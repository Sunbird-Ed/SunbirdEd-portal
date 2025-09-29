/**
 * Ask Routes - Backend routes for Ask functionality
 * This file provides proxy routes to the NLWeb service with unified response handling
 * Supports all 8 NLWeb tools: Search, Details, Ensemble, etc.
 */

const express = require('express');
const axios = require('axios');
const envHelper = require('../helpers/environmentVariablesHelper');
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const router = express.Router();

// Add body parsing middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// NLWeb service configuration (uses env helper -> optionalEnv.NLWEB_BASE_URL)
const NLWEB_BASE_URL = envHelper.NLWEB_BASE_URL

// Supported NLWeb tools
const NLWEB_TOOLS = [
  'search',
  'details', 
  'ensemble',
  'recommend',
  'explain',
  'compare',
  'summarize',
  'generate'
];

/**
 * Proxy route for Ask functionality
 * POST /nlweb/ask/proxy
 */
router.post('/nlweb/ask/proxy', isAPIWhitelisted.isAllowed(), async (req, res) => {
  let query = '';
  
  try {
    console.log('Ask proxy received request body:', req.body);
    console.log('Ask proxy received headers:', req.headers);
    
    const { query: reqQuery, site = 'all', model = 'gpt-4o-mini', streaming = false, generate_mode = 'none', oauth_id = '', thread_id = '' } = req.body;
    query = reqQuery; // Store query in outer scope for error handling

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required'
      });
    }

    // Prepare request parameters - match NLWeb API format
    // Transform queries to encourage ensemble tool usage for comprehensive answers
    const ensembleQuery = transformQueryForEnsemble(query);
    
    const params = new URLSearchParams({
      query: ensembleQuery,
      generate_mode: generate_mode || 'list',
      display_mode: 'full',
      site: site,
      item_to_remember: query, // Use original query as item_to_remember
      thread_id: thread_id
    });

    console.log('Making request to NLWeb:', `${NLWEB_BASE_URL}/ask?${params}`);

    // Make request to NLWeb service with streaming support
    const nlwebResponse = await axios.get(`${NLWEB_BASE_URL}/ask?${params}`, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      },
      responseType: 'stream'
    });

    // Handle streaming response
    let responseData = '';
    
    nlwebResponse.data.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      console.log('Received chunk:', chunkStr);
      responseData += chunkStr;
    });

    nlwebResponse.data.on('end', () => {
      try {
        console.log('Stream ended. Full response data length:', responseData.length);
        
        // Parse the streaming response - NLWeb sends Server-Sent Events format
        // Events are separated by double newlines. Each event may contain multi-line data:
        // data: {"json": ...}\n
        const events = responseData.split('\n\n').filter(evt => evt.trim());
        const results = [];
        let toolSelection = null;
        let rememberData = null;

        for (const evt of events) {
          try {
            // Stitch together all data: lines in this event
            const dataLines = evt
              .split('\n')
              .map(l => l.trim())
              .filter(l => l.startsWith('data:'))
              .map(l => l.substring(5).trim());

            if (dataLines.length === 0) continue;

            const jsonStr = dataLines.join('');
            if (!jsonStr) continue;

            const data = JSON.parse(jsonStr);
            console.log('Parsed SSE event:', data.message_type);

            // Handle result_batch messages - these contain the actual results
            if (data.message_type === 'result_batch' && data.results && Array.isArray(data.results)) {
              console.log('Processing result_batch with', data.results.length, 'results');
              data.results.forEach((result, index) => {
                const schemaObject = result.schema_object || result;
                let score = result.score || 0;
                if (typeof score === 'string') score = parseFloat(score) || 0;
                if (score > 0 && score <= 1) score = score * 100;
                score = Math.max(0, Math.min(100, score));
                const contentMetadata = extractContentMetadata(schemaObject);
                results.push({
                  name: result.name || schemaObject.name || 'Untitled',
                  url: result.url || schemaObject.contentUrl || '',
                  description: result.description || schemaObject.description || '',
                  snippet: result.description || schemaObject.description || '',
                  score: Math.round(score),
                  type: determineContentType(result, schemaObject),
                  thumbnail: result.thumbnail || schemaObject.thumbnailUrl || '',
                  schema_object: schemaObject,
                  recommendation: result.description || schemaObject.description || '',
                  details: result.details || {},
                  site: result.site || '',
                  medium: contentMetadata.medium,
                  subject: contentMetadata.subject,
                  grade: contentMetadata.grade,
                  board: contentMetadata.board
                });
              });
            }

            // Handle 'result' messages - NLWeb streams individual batches under `content`
            if (data.message_type === 'result') {
              const contentPayload = Array.isArray(data.content)
                ? data.content
                : (typeof data.content === 'string'
                    ? (() => { try { return JSON.parse(data.content); } catch { return []; } })()
                    : (data.content && data.content.items && Array.isArray(data.content.items) ? data.content.items : (data.content ? [data.content] : [])));

              console.log('Processing result payload. IsArray:', Array.isArray(contentPayload), 'length:', contentPayload.length);
              contentPayload.forEach((item) => {
                const schemaObject = item.schema_object || item;
                let score = item.score || 0;
                if (typeof score === 'string') score = parseFloat(score) || 0;
                if (score > 0 && score <= 1) score = score * 100;
                score = Math.max(0, Math.min(100, score));

                const contentMetadata = extractContentMetadata(schemaObject);
                const normalized = {
                  name: item.name || schemaObject.name || 'Untitled',
                  url: item.url || schemaObject.contentUrl || schemaObject.identifier || '',
                  description: item.description || schemaObject.description || '',
                  snippet: item.description || schemaObject.description || '',
                  score: Math.round(score),
                  type: determineContentType(item, schemaObject),
                  thumbnail: item.thumbnail || schemaObject.thumbnailUrl || schemaObject.appIcon || '',
                  schema_object: schemaObject,
                  recommendation: item.why_recommended || item.description || schemaObject.description || '',
                  details: item.details || {},
                  site: item.site || '',
                  medium: contentMetadata.medium,
                  subject: contentMetadata.subject,
                  grade: contentMetadata.grade,
                  board: contentMetadata.board
                };

                // Filter out empty/meaningless results here to avoid final 0 due to later filtering
                const hasName = normalized.name && normalized.name.trim().toLowerCase() !== 'untitled';
                const hasUrl = normalized.url && normalized.url.trim();
                const hasDesc = normalized.description && normalized.description.trim();
                const hasScore = typeof normalized.score === 'number' && normalized.score > 0;
                if (hasName && (hasUrl || hasDesc || hasScore)) {
                  results.push(normalized);
                }
              });
            }

            // Collect item_details as results (legacy support)
            if (data.message_type === 'item_details') {
              const item = data.schema_object || {};
              let score = data.score || 0;
              if (typeof score === 'string') score = parseFloat(score) || 0;
              if (score > 0 && score <= 1) score = score * 100;
              score = Math.max(0, Math.min(100, score));
              const contentMetadata = extractContentMetadata(item);
              results.push({
                name: data.name || item.name || 'Untitled',
                url: data.url || item.url || '',
                description: item.description || data.explanation || '',
                snippet: data.explanation || item.description || '',
                score: Math.round(score),
                type: determineContentType(data, item),
                thumbnail: item.thumbnailUrl || '',
                schema_object: item,
                recommendation: data.details ? JSON.stringify(data.details) : '',
                details: data.details || {},
                site: data.site || '',
                medium: contentMetadata.medium,
                subject: contentMetadata.subject,
                grade: contentMetadata.grade,
                board: contentMetadata.board
              });
            }

            // Handle ensemble results - comprehensive recommendations
            if (data.message_type === 'ensemble_result') {
              const ensembleData = data.result;
              if (ensembleData && ensembleData.success && ensembleData.recommendations) {
                const recommendations = ensembleData.recommendations;
                if (recommendations.items && Array.isArray(recommendations.items)) {
                  recommendations.items.forEach((item, index) => {
                    const baseScore = 95;
                    const positionPenalty = index * 2;
                    const calculatedScore = Math.max(baseScore - positionPenalty, 70);
                    const schemaObject = item.schema_object || item;
                    const contentMetadata = extractContentMetadata(schemaObject);
                    results.push({
                      name: item.name || 'Untitled',
                      url: item.url || '',
                      description: item.description || '',
                      snippet: item.why_recommended || item.description || '',
                      score: calculatedScore,
                      type: 'ensemble_recommendation',
                      category: item.category || '',
                      thumbnail: item.schema_object?.thumbnailUrl || '',
                      schema_object: item.schema_object || item,
                      recommendation: item.why_recommended || '',
                      details: item.details || {},
                      site: 'ensemble',
                      ensemble_theme: recommendations.theme || '',
                      ensemble_tips: recommendations.overall_tips || [],
                      ensemble_type: ensembleData.ensemble_type || 'general',
                      total_items_retrieved: ensembleData.total_items_retrieved || 0,
                      medium: contentMetadata.medium,
                      subject: contentMetadata.subject,
                      grade: contentMetadata.grade,
                      board: contentMetadata.board
                    });
                  });
                }
              }
            }

            if (data.message_type === 'intermediate_message') {
              console.log('Ensemble processing:', data.message);
            }

            if (data.message_type === 'tool_selection') {
              toolSelection = data;
            }

            if (data.message_type === 'remember') {
              rememberData = data;
            }
          } catch (e) {
            console.log('Skipping invalid SSE event due to parse error:', e.message);
            continue;
          }
        }
        
        // Sort results by score in descending order (highest score first)
        results.sort((a, b) => {
          const scoreA = parseFloat(a.score) || 0;
          const scoreB = parseFloat(b.score) || 0;
          return scoreB - scoreA; // Descending order
        });
        
        console.log('Total results collected:', results.length);
        console.log('Sample result:', results[0]);
        
        // Create final response using normalization
        const rawResponse = {
          message_type: 'result_batch',
          results: results,
          tool_selection: toolSelection,
          remember: rememberData,
          query: query,
          ensemble_info: results.length > 0 && results[0].type === 'ensemble_recommendation' ? {
            theme: results[0].ensemble_theme,
            tips: results[0].ensemble_tips,
            type: results[0].ensemble_type,
            total_items_retrieved: results[0].total_items_retrieved
          } : null
        };
        
        // Normalize the response for consistent frontend handling
        const finalResponse = normalizeNLWebResponse(rawResponse, query);
        
        console.log('Final normalized response:', finalResponse);
        console.log('Final results count:', finalResponse.results ? finalResponse.results.length : 0);
        res.json(finalResponse);
        
      } catch (error) {
        console.error('Error processing streaming response:', error);
        res.status(500).json({
          error: 'Error processing response',
          message: 'Failed to process the streaming response from NLWeb service'
        });
      }
    });

    nlwebResponse.data.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({
        error: 'Stream error',
        message: 'Error reading streaming response from NLWeb service'
      });
    });

  } catch (error) {
    console.error('Error proxying Ask request:', error);
    
    // Handle different types of errors
    // if (error.code === 'ECONNREFUSED') {
    //   // NLWeb service is not running - return mock data for testing
    //   console.log('NLWeb service not available, returning mock data for testing');
    //   const mockResponse = createMockResponse(query);
    //   return res.json(mockResponse);
    // } else 
    if (error.response) {
      // NLWeb service returned an error
      return res.status(error.response.status).json({
        error: 'NLWeb service error',
        message: error.response.data?.error || 'An error occurred while processing your request'
      });
    } else {
      // Other errors
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    }
  }
});

/**
 * Health check route for Ask service
 * GET /nlweb/ask/health
 */
router.get('/nlweb/ask/health', isAPIWhitelisted.isAllowed(), async (req, res) => {
  try {
    // Check if NLWeb service is available
    const healthResponse = await axios.get(`${NLWEB_BASE_URL}/who`, {
      timeout: 5000
    });

    res.json({
      status: 'healthy',
      nlweb: 'available',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ask service health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      nlweb: 'unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get available sites from NLWeb
 * GET /nlweb/ask/sites
 */
router.get('/nlweb/ask/sites', isAPIWhitelisted.isAllowed(), async (req, res) => {
  try {
    const sitesResponse = await axios.get(`${NLWEB_BASE_URL}/sites`, {
      timeout: 10000
    });

    res.json(sitesResponse.data);

  } catch (error) {
    console.error('Error getting sites from NLWeb:', error);
    
    res.status(500).json({
      error: 'Failed to get available sites',
      message: 'Could not retrieve the list of available sites'
    });
  }
});

/**
 * Create mock response for testing when NLWeb is not available
 */
function createMockResponse(query) {
  return {
    message_type: 'result_batch',
    results: [
      {
        name: `Resources for ${query}`,
        url: 'https://example.com/resource1',
        description: `Comprehensive educational materials covering ${query} with interactive content and examples.`,
        snippet: `Learn about ${query} through engaging multimedia content.`,
        score: 0.95,
        type: 'content',
        thumbnail: '',
        schema_object: {},
        recommendation: `This resource provides a comprehensive overview of ${query} suitable for students and educators.`
      },
      {
        name: `Interactive Video: ${query}`,
        url: 'https://example.com/video1',
        description: `An interactive video tutorial explaining ${query} with step-by-step demonstrations.`,
        snippet: `Watch and learn ${query} through visual demonstrations.`,
        score: 0.88,
        type: 'video',
        thumbnail: '',
        schema_object: {},
        recommendation: `Perfect for visual learners who want to understand ${query} through interactive content.`
      },
      {
        name: `PDF Guide: ${query}`,
        url: 'https://example.com/pdf1',
        description: `Detailed PDF guide with exercises and practice problems for ${query}.`,
        snippet: `Downloadable PDF with comprehensive coverage of ${query}.`,
        score: 0.82,
        type: 'pdf',
        thumbnail: '',
        schema_object: {},
        recommendation: `Excellent reference material for in-depth study of ${query}.`
      }
    ]
  };
}

/**
 * Normalize NLWeb response from different tools into unified structure
 * This function handles responses from all 8 NLWeb tools and creates a consistent format
 * @param nlwebResponse - Raw response from NLWeb
 * @param originalQuery - Original user query
 * @returns Normalized response object
 */
function normalizeNLWebResponse(nlwebResponse, originalQuery) {
  console.log('Normalizing NLWeb response:', nlwebResponse);
  console.log('Input results count:', nlwebResponse.results ? nlwebResponse.results.length : 0);
  
  const normalizedResponse = {
    message_type: 'result_batch',
    query: originalQuery,
    query_id: nlwebResponse.query_id || `ask_${Date.now()}`,
    tool_selection: nlwebResponse.tool_selection || null,
    remember: nlwebResponse.remember || null,
    ensemble_info: null,
    results: []
  };

  // Process different message types from NLWeb
  if (nlwebResponse.results && Array.isArray(nlwebResponse.results)) {
    console.log('Processing', nlwebResponse.results.length, 'results for normalization');
    normalizedResponse.results = nlwebResponse.results.map((result, index) => {
      console.log('Normalizing result', index, ':', result.name);
      return normalizeResult(result, index);
    });
    console.log('Normalized results count:', normalizedResponse.results.length);
  } else {
    console.log('No results found in response or results is not an array');
  }

  // Extract ensemble information if present
  if (normalizedResponse.results.length > 0 && normalizedResponse.results[0].ensemble_theme) {
    normalizedResponse.ensemble_info = {
      theme: normalizedResponse.results[0].ensemble_theme,
      tips: normalizedResponse.results[0].ensemble_tips || [],
      type: normalizedResponse.results[0].ensemble_type || 'general',
      total_items_retrieved: normalizedResponse.results[0].total_items_retrieved || 0
    };
  }

  console.log('Final normalized response results count:', normalizedResponse.results.length);
  return normalizedResponse;
}

/**
 * Normalize individual result from NLWeb tool response
 * @param result - Raw result from NLWeb
 * @param index - Index of the result for ID generation
 * @returns Normalized result object
 */
function normalizeResult(result, index) {
  const schemaObject = result.schema_object || result;
  
  // Extract content metadata from schema_object
  const contentMetadata = extractContentMetadata(schemaObject);
  
  // Generate unique ID if not present
  const id = result.id || `ask_result_${Date.now()}_${index}`;
  
  // Normalize score to 0-100 range
  const normalizedScore = normalizeScore(result.score);
  
  // Determine content type
  const contentType = determineContentType(result, schemaObject);
  
  return {
    // Core identification
    id: id,
    name: result.name || result.title || 'Untitled',
    url: result.url || '',
    
    // Content information
    description: result.description || result.snippet || '',
    snippet: result.snippet || result.description || '',
    type: contentType,
    category: result.category || '',
    
    // Scoring and relevance
    score: normalizedScore,
    relevance: normalizedScore,
    
    // Media and presentation
    thumbnail: result.thumbnail || result.image || schemaObject.thumbnailUrl || '',
    image: result.image || schemaObject.thumbnailUrl || '',
    
    // Educational metadata
    medium: contentMetadata.medium,
    subject: contentMetadata.subject,
    grade: contentMetadata.grade,
    board: contentMetadata.board,
    
    // Recommendations and explanations
    recommendation: result.recommendation || result.why_recommended || '',
    why_recommended: result.why_recommended || result.recommendation || '',
    
    // Technical metadata
    schema_object: schemaObject,
    details: result.details || {},
    site: result.site || '',
    
    // Ensemble-specific fields
    ensemble_theme: result.ensemble_theme,
    ensemble_tips: result.ensemble_tips,
    ensemble_type: result.ensemble_type,
    total_items_retrieved: result.total_items_retrieved
  };
}

/**
 * Normalize score to 0-100 range
 * @param score - Raw score value
 * @returns Normalized score (0-100)
 */
function normalizeScore(score) {
  if (!score) return 0;
  
  let numScore = typeof score === 'string' ? parseFloat(score) : score;
  
  if (isNaN(numScore)) return 0;
  
  // If score is in decimal format (0-1), convert to percentage (0-100)
  if (numScore > 0 && numScore <= 1) {
    numScore = numScore * 100;
  }
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, Math.round(numScore)));
}

/**
 * Determine content type from result and schema object
 * @param result - The result object
 * @param schemaObject - The schema object
 * @returns Content type string
 */
function determineContentType(result, schemaObject) {
  // Check explicit type first
  if (result.type) {
    return result.type.toLowerCase();
  }
  
  // Check encoding format
  if (schemaObject.encodingFormat) {
    const format = schemaObject.encodingFormat.toLowerCase();
    if (format.includes('video') || format.includes('mp4')) return 'video';
    if (format.includes('pdf') || format.includes('application/pdf')) return 'pdf';
    if (format.includes('textbook') || format.includes('etextbook')) return 'etextbook';
    if (format.includes('presentation') || format.includes('ppt')) return 'presentation';
    if (format.includes('audio') || format.includes('mp3')) return 'audio';
    if (format.includes('interactive') || format.includes('h5p')) return 'interactive';
  }
  
  // Check genre
  if (schemaObject.genre && Array.isArray(schemaObject.genre)) {
    const genre = schemaObject.genre.find((g) => 
      g.toLowerCase().includes('video') || 
      g.toLowerCase().includes('pdf') || 
      g.toLowerCase().includes('textbook') ||
      g.toLowerCase().includes('presentation')
    );
    if (genre) {
      return formatMediumName(genre).toLowerCase();
    }
  }
  
  // Check URL for hints
  if (result.url) {
    if (result.url.includes('youtube.com') || result.url.includes('video')) return 'video';
    if (result.url.includes('.pdf') || result.url.includes('pdf')) return 'pdf';
    if (result.url.includes('course') || result.url.includes('learn')) return 'course';
  }
  
  // Default to content
  return 'content';
}

/**
 * Transform query to encourage ensemble tool usage
 * This function modifies queries to make them more likely to trigger the ensemble tool
 * which provides comprehensive, multi-faceted answers
 */
function transformQueryForEnsemble(originalQuery) {
  if (!originalQuery || typeof originalQuery !== 'string') {
    return originalQuery;
  }
  
  const query = originalQuery.toLowerCase().trim();
  
  // Check if query already looks like an ensemble request
  const ensembleKeywords = [
    'plan', 'suggest', 'recommend', 'give me', 'show me', 'help me',
    'what should', 'how to', 'best way', 'complete', 'full', 'comprehensive',
    'multiple', 'different', 'various', 'all', 'everything', 'both',
    'lesson', 'teaching', 'learning', 'study', 'resources', 'materials'
  ];
  
  const hasEnsembleKeywords = ensembleKeywords.some(keyword => query.includes(keyword));
  
  // If it already has ensemble keywords, return as is
  if (hasEnsembleKeywords) {
    return originalQuery;
  }
  
  // Check for educational/mathematical concepts that should trigger ensemble
  const educationalConcepts = [
    'area', 'volume', 'perimeter', 'surface area', 'formula', 'equation',
    'geometry', 'algebra', 'calculus', 'trigonometry', 'statistics',
    'cone', 'cylinder', 'sphere', 'triangle', 'circle', 'square', 'rectangle',
    'fraction', 'decimal', 'percentage', 'ratio', 'proportion'
  ];
  
  const hasEducationalConcepts = educationalConcepts.some(concept => query.includes(concept));
  
  // For educational concepts, return as is to let ensemble tool handle naturally
  if (hasEducationalConcepts) {
    return originalQuery;
  }
  
  // Transform simple queries into ensemble-style requests
  if (query.includes('find') || query.includes('search') || query.includes('show')) {
    return `Give me comprehensive recommendations and suggestions for ${originalQuery}`;
  }
  
  if (query.includes('what') || query.includes('how') || query.includes('where')) {
    return `Help me understand and explore ${originalQuery} with detailed recommendations`;
  }
  
  if (query.includes('best') || query.includes('good') || query.includes('recommend')) {
    return `Suggest the best options and alternatives for ${originalQuery}`;
  }
  
  // For general queries, add ensemble-style language
  return `Give me a comprehensive overview and recommendations for ${originalQuery}`;
}

/**
 * Transform NLWeb response to match Sunbird format
 */
function transformNLWebResponse(nlwebData) {
  // If NLWeb returns results in a specific format, transform them
  if (nlwebData && typeof nlwebData === 'object') {
    // Check if it's a result_batch format
    if (nlwebData.message_type === 'result_batch' && nlwebData.results) {
      return {
        message_type: 'result_batch',
        results: nlwebData.results.map(result => ({
          name: result.name || result.title || 'Untitled',
          url: result.url || '',
          description: result.description || result.snippet || '',
          snippet: result.snippet || result.description || '',
          score: result.score || 0,
          type: result.type || 'content',
          thumbnail: result.thumbnail || result.image || '',
          schema_object: result.schema_object || result,
          recommendation: result.recommendation || result.why_recommended || ''
        }))
      };
    }
    
    // If it's already in the right format, return as is
    return nlwebData;
  }
  
  // Fallback: return the data as is
  return nlwebData;
}

/**
 * Extract content metadata from schema object
 * @param schemaObject - The schema object containing content metadata
 * @returns Object with extracted metadata
 */
function extractContentMetadata(schemaObject) {
  if (!schemaObject) {
    return {
      medium: '',
      subject: [],
      grade: [],
      board: []
    };
  }

  // Extract medium/format
  let medium = '';
  if (schemaObject.encodingFormat) {
    medium = formatMediumName(schemaObject.encodingFormat);
  } else if (schemaObject.genre && Array.isArray(schemaObject.genre)) {
    const genre = schemaObject.genre.find(g => 
      g.toLowerCase().includes('video') || 
      g.toLowerCase().includes('pdf') || 
      g.toLowerCase().includes('textbook') ||
      g.toLowerCase().includes('presentation')
    );
    if (genre) {
      medium = formatMediumName(genre);
    }
  }

  // Extract subject from educational alignment
  let subject = [];
  if (schemaObject.educationalAlignment) {
    subject = schemaObject.educationalAlignment
      .filter(alignment => alignment.alignmentType === 'subject')
      .map(alignment => alignment.targetName)
      .filter(subj => subj && subj.trim());
  }

  // Extract grade level from educational alignment
  let grade = [];
  if (schemaObject.educationalAlignment) {
    grade = schemaObject.educationalAlignment
      .filter(alignment => alignment.alignmentType === 'educationalLevel')
      .map(alignment => alignment.targetName)
      .filter(gradeLevel => gradeLevel && gradeLevel.trim());
  }

  // Extract board from educational alignment
  let board = [];
  if (schemaObject.educationalAlignment) {
    board = schemaObject.educationalAlignment
      .filter(alignment => alignment.alignmentType === 'board')
      .map(alignment => alignment.targetName)
      .filter(boardName => boardName && boardName.trim());
  }

  return {
    medium: medium,
    subject: subject,
    grade: grade,
    board: board
  };
}

/**
 * Format medium name for display
 * @param medium - Raw medium string
 * @returns Formatted medium string
 */
function formatMediumName(medium) {
  if (!medium) return '';
  
  const mediumLower = medium.toLowerCase();
  
  if (mediumLower.includes('video') || mediumLower.includes('mp4')) {
    return 'Video';
  } else if (mediumLower.includes('pdf') || mediumLower.includes('application/pdf')) {
    return 'PDF';
  } else if (mediumLower.includes('textbook') || mediumLower.includes('etextbook')) {
    return 'eTextbook';
  } else if (mediumLower.includes('presentation') || mediumLower.includes('ppt')) {
    return 'Presentation';
  } else if (mediumLower.includes('audio') || mediumLower.includes('mp3')) {
    return 'Audio';
  } else if (mediumLower.includes('interactive') || mediumLower.includes('h5p')) {
    return 'Interactive';
  }
  
  return medium;
}

module.exports = (app) => {
  app.use('/nlweb/ask', router);
};
