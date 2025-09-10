/**
 * Ask Routes - Backend routes for Ask functionality
 * This file provides proxy routes to the NLWeb service
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Add body parsing middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// NLWeb service configuration
const NLWEB_BASE_URL = process.env.NLWEB_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Proxy route for Ask functionality
 * POST /api/ask/proxy
 */
router.post('/proxy', async (req, res) => {
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
        console.log('Stream ended. Full response data:', responseData);
        
        // Parse the streaming response - NLWeb sends Server-Sent Events format
        const lines = responseData.split('\n').filter(line => line.trim());
        const results = [];
        let toolSelection = null;
        let rememberData = null;
        
        // Process each line in the stream
        for (const line of lines) {
          try {
            // Handle Server-Sent Events format - strip 'data: ' prefix if present
            let jsonLine = line;
            if (line.startsWith('data: ')) {
              jsonLine = line.substring(6); // Remove 'data: ' prefix
            }
            
            // Skip empty lines or non-JSON lines
            if (!jsonLine.trim()) {
              continue;
            }
            
            const data = JSON.parse(jsonLine);
            console.log('Parsed message:', data.message_type, data);
            
            // Collect item_details as results
            if (data.message_type === 'item_details') {
              // Handle the actual structure from NLWeb
              const item = data.schema_object || {};
              
              // Ensure score is properly formatted (0-100 range)
              let score = data.score || 0;
              if (typeof score === 'string') {
                score = parseFloat(score) || 0;
              }
              // If score is in decimal format (0-1), convert to percentage (0-100)
              if (score > 0 && score <= 1) {
                score = score * 100;
              }
              // Ensure score is within 0-100 range
              score = Math.max(0, Math.min(100, score));
              
              // Extract content metadata from schema object
              const contentMetadata = extractContentMetadata(item);
              
              results.push({
                name: data.name || item.name || 'Untitled',
                url: data.url || item.url || '',
                description: item.description || data.explanation || '',
                snippet: data.explanation || item.description || '',
                score: Math.round(score), // Round to nearest integer
                type: item.encodingFormat || 'content',
                thumbnail: item.thumbnailUrl || '',
                schema_object: item,
                recommendation: data.details ? JSON.stringify(data.details) : '',
                details: data.details || {},
                site: data.site || '',
                // Content metadata
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
                
                // Process ensemble items
                if (recommendations.items && Array.isArray(recommendations.items)) {
                  recommendations.items.forEach((item, index) => {
                    // Calculate proper score based on position and relevance
                    // First item gets highest score, subsequent items get slightly lower scores
                    const baseScore = 95; // Start with 95%
                    const positionPenalty = index * 2; // Reduce by 2% for each position
                    const calculatedScore = Math.max(baseScore - positionPenalty, 70); // Minimum 70%
                    
                    // Extract content metadata from ensemble item
                    const schemaObject = item.schema_object || item;
                    const contentMetadata = extractContentMetadata(schemaObject);
                    
                    results.push({
                      name: item.name || 'Untitled',
                      url: item.url || '',
                      description: item.description || '',
                      snippet: item.why_recommended || item.description || '',
                      score: calculatedScore, // Proper score based on position and relevance
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
                      // Content metadata
                      medium: contentMetadata.medium,
                      subject: contentMetadata.subject,
                      grade: contentMetadata.grade,
                      board: contentMetadata.board
                    });
                  });
                }
              }
            }
            
            // Handle intermediate messages from ensemble processing
            if (data.message_type === 'intermediate_message') {
              // Log intermediate messages for debugging
              console.log('Ensemble processing:', data.message);
            }
            
            // Store tool selection info
            if (data.message_type === 'tool_selection') {
              toolSelection = data;
            }
            
            // Store remember data
            if (data.message_type === 'remember') {
              rememberData = data;
            }
            
          } catch (e) {
            console.log('Skipping invalid JSON line:', line, 'Error:', e.message);
            continue;
          }
        }
        
        // Sort results by score in descending order (highest score first)
        results.sort((a, b) => {
          const scoreA = parseFloat(a.score) || 0;
          const scoreB = parseFloat(b.score) || 0;
          return scoreB - scoreA; // Descending order
        });
        
        // Create final response
        const finalResponse = {
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
        
        console.log('Final response:', finalResponse);
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
 * GET /api/ask/health
 */
router.get('/health', async (req, res) => {
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
 * GET /api/ask/sites
 */
router.get('/sites', async (req, res) => {
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
        name: `Educational Resources for ${query}`,
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
  app.use('/api/ask', router);
};
