/**
 * Script to preserve FancyTree jQuery plugin after other scripts might override jQuery
 * This should be loaded AFTER jquery.fancytree but BEFORE any problematic web components
 */
(function() {
    'use strict';
    
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
    }, 100);
    
    // Clear interval after 10 seconds to avoid infinite checking
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 10000);
    
    // Make restore function available globally for manual restoration
    window.restoreFancyTree = restoreFancyTree;
    
})();