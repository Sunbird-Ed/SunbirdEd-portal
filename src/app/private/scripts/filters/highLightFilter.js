/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

angular.module('playerApp').filter('highlight', function($sce) {
    /**
     * Used to filter a text with highlighted color
     * @param  {string} text   Text element .
     * @param  {string} phrase Text element which is need to be search.
     * @return {object}        Dom element
     */
    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span id="highlighted" style = "color:#009fda">$1</span>')
        return $sce.trustAsHtml(text)
    }

});