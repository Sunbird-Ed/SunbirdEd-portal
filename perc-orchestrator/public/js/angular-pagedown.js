app.directive('ngIlPagedown', function ($compile, $timeout) {
    var nextId = 0;
    var converter = Markdown.getSanitizingConverter();
    converter.hooks.chain("preBlockGamut", function (text, rbg) {
        return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, function (whole, inner) {
            return "<blockquote>" + rbg(inner) + "</blockquote>\n";
        });
    });

    return {
        require: 'ngModel',
        replace: true,
        template: '<div class="pagedown-bootstrap-editor"></div>',
        scope: {
            preview: '=',
            editorheight: '='
        },
        link: function (scope, iElement, attrs, ngModel) {
            scope.showPreview = true;
            if(scope.preview == 'true' || scope.preview == 'false') {
                scope.showPreview = Boolean(scope.preview);
            }
            if(typeof scope.preview == 'boolean') {
                scope.showPreview = scope.preview;
            }
            var setHeight = "";
            if(scope.editorheight && (typeof scope.editorheight == 'number')) {
                setHeight = "height:"+scope.editorheight+"px;";
            }
            var editorUniqueId;

            if (attrs.id == null) {
                editorUniqueId = nextId++;
            } else {
                editorUniqueId = attrs.id;
            }
            var newElement = $compile(
                '<div>' +
                   '<div class="wmd-panel">' +
                      '<div id="wmd-button-bar-' + editorUniqueId + '"></div>' +
                      '<textarea class="wmd-input" style="'+setHeight+'" id="wmd-input-' + editorUniqueId + '">' +
                      '</textarea>' +
                   '</div><h4 ng-show="showPreview">Preview</h4>' +
                   '<div ng-show="showPreview" id="wmd-preview-' + editorUniqueId + '" class="pagedown-preview wmd-panel wmd-preview"></div>' +
                '</div>')(scope);

            iElement.html(newElement);

            var help = function () {
                console.log("There is no help");
            }

            var editor = new Markdown.Editor(converter, "-" + editorUniqueId, {
                handler: help
            });

            var $wmdInput = iElement.find('#wmd-input-' + editorUniqueId);

            var init = false;

            editor.hooks.chain("onPreviewRefresh", function () {
                var val = $wmdInput.val();
                if (init) {
                    $timeout(function(){
                        scope.$apply(function(){
                            ngModel.$setViewValue($('#wmd-preview-' + editorUniqueId).html());
                            ngModel.$render();
                        });
                    });
                }
            });

            ngModel.$formatters.push(function(value){
                init = true;
                if(value) {
                    $wmdInput.val(toMarkdown(value));
                } else {
                    $wmdInput.val(value);
                }
                editor.refreshPreview();
                return value;
            });

            editor.run();
        }
    }
});