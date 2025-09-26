/**
 * Script to preserve FancyTree jQuery plugin after other scripts might override jQuery
 * This should be loaded AFTER jquery.fancytree but BEFORE any problematic web components
 */
(function() {
    'use strict';
    
    // Constants for timing configuration
    var CHECK_INTERVAL_MS = 100; // milliseconds between restoration checks
    var MAX_CHECK_DURATION_MS = 10000; // maximum time to keep checking (10 seconds)
    
    // Store reference to fancytree plugin before it gets overridden
    var originalFancyTree = null;
    var originalJQuery = null;
    
    if (typeof jQuery !== 'undefined' && jQuery.fn && jQuery.fn.fancytree) {
        originalJQuery = jQuery;
        originalFancyTree = jQuery.fn.fancytree;
        console.log('✓ FancyTree plugin preserved');
    }
    
    // Function to restore fancytree if it gets lost
    function restoreFancyTree() {
        if (originalFancyTree && typeof jQuery !== 'undefined' && jQuery.fn && !jQuery.fn.fancytree) {
            jQuery.fn.fancytree = originalFancyTree;
            // Also restore any related fancytree methods
            if (originalJQuery && originalJQuery.fancytree) {
                jQuery.fancytree = originalJQuery.fancytree;
            }
            console.log('⚡ FancyTree plugin restored after being overridden');
            return true;
        }
        return false;
    }
    
    // Check periodically if fancytree got lost and restore it
    var checkInterval = setInterval(function() {
        if (typeof jQuery !== 'undefined' && jQuery.fn && !jQuery.fn.fancytree && originalFancyTree) {
            if (restoreFancyTree()) {
                // Clear interval after successful restoration
                clearInterval(checkInterval);
            }
        }
    }, CHECK_INTERVAL_MS);
    
    // Clear interval after maximum duration to avoid infinite checking
    setTimeout(function() {
        clearInterval(checkInterval);
    }, MAX_CHECK_DURATION_MS);
    
    // Make restore function available globally for manual restoration
    window.restoreFancyTree = restoreFancyTree;
    
})();