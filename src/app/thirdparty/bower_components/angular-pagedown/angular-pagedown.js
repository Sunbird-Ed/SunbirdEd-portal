// Mardown Extra Options
var mdExtraOptions = {
    extensions: "all",
    table_class: 'table'
};

// adapted from http://stackoverflow.com/a/20957476/940030
angular.module("ui.pagedown", [])
    .directive("pagedownEditor", ['$compile', '$timeout', '$window', '$q', function ($compile, $timeout, $window, $q) {
        var nextId = 0;
        var converter = Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, mdExtraOptions);

        converter.hooks.chain("preBlockGamut", function (text, rbg) {
            return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, function (whole, inner) {
                return "<blockquote>" + rbg(inner) + "</blockquote>\n";
            });
        });

        return {
            restrict: "E",
            require: 'ngModel',
            scope: {
                ngModel: "=",
                placeholder: "@",
                showPreview: "@",
                help: "&",
                insertImage: "&",
                editorClass: "=?",
                editorRows: "@",
                previewClass: "=?",
                previewContent: "=?"
            },
            link: function (scope, element, attrs, ngModel) {

                scope.changed = function () {
                    ngModel.$setDirty();
                    scope.$parent.$eval(attrs.ngChange);
                };


                var editorUniqueId;

                if (attrs.id == null) {
                    editorUniqueId = nextId++;
                } else {
                    editorUniqueId = attrs.id;
                }

                // just hide the preview, we still need it for "onPreviewRefresh" hook
                var previewHiddenStyle = scope.showPreview == "false" ? "display: none;" : "";

                var placeholder = attrs.placeholder || "";
                var editorRows = attrs.editorRows || "10";

                var newElement = $compile(
                    '<div>' +
                    '<div class="wmd-panel">' +
                    '<div id="wmd-button-bar-' + editorUniqueId + '"></div>' +
                    '<textarea id="wmd-input-' + editorUniqueId + '" placeholder="' + placeholder + '" ng-model="ngModel"' +
                    ' ng-change="changed()"' +
                    ' rows="' + editorRows + '" ' + (scope.editorClass ? 'ng-class="editorClass"' : 'class="wmd-input"') + '>' +
                    '</textarea>' +
                    '</div>' +
                    '<div id="wmd-preview-' + editorUniqueId + '" style="' + previewHiddenStyle + '"' +
                    ' ' + (scope.previewClass ? 'ng-class="previewClass"' : 'class="wmd-panel wmd-preview"') + '>' +
                    '</div>' +
                    '</div>')(scope);

                // html() doesn't work
                element.append(newElement);

                var help = angular.isFunction(scope.help) ? scope.help : function () {
                    // redirect to the guide by default
                    $window.open("http://daringfireball.net/projects/markdown/syntax", "_blank");
                };

                var editor = new Markdown.Editor(converter, "-" + editorUniqueId, {
                    handler: help
                });


                var editorElement = angular.element(document.getElementById("wmd-input-" + editorUniqueId));

                editorElement.val(scope.ngModel);

                converter.hooks.chain("postConversion", function (text) {
                    ngModel.$setViewValue(editorElement.val());

                    // update
                    scope.previewContent = text;
                    return text;
                });


                // add watch for content
                if (scope.showPreview != "false") {
                    scope.$watch('content', function () {
                        editor.refreshPreview();
                    });
                }
                editor.hooks.chain("onPreviewRefresh", function () {
                    // wire up changes caused by user interaction with the pagedown controls
                    // and do within $apply
                    $timeout(function () {
                        scope.content = editorElement.val();
                    });
                });

                if (angular.isFunction(scope.insertImage)) {
                    editor.hooks.set("insertImageDialog", function (callback) {
                        // expect it to return a promise or a url string
                        var result = scope.insertImage();

                        // Note that you cannot call the callback directly from the hook; you have to wait for the current scope to be exited.
                        // https://code.google.com/p/pagedown/wiki/PageDown#insertImageDialog
                        $timeout(function () {
                            if (!result) {
                                // must be null to indicate failure
                                callback(null);
                            } else {
                                // safe way to handle either string or promise
                                $q.when(result).then(
                                    function success(imgUrl) {
                                        callback(imgUrl);
                                    },
                                    function error(reason) {
                                        callback(null);
                                    }
                                );
                            }
                        });

                        return true;
                    });
                }

                editor.run();
            }
        }
    }])
    .directive("pagedownViewer", ['$compile', '$sce', function ($compile, $sce) {
        var converter = Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, mdExtraOptions);

        return {
            restrict: "E",
            scope: {
                content: "="
            },
            link: function (scope, element, attrs) {
                var run = function run() {
                    if (!scope.content) {
                        scope.sanitizedContent = '';
                        return;
                    }

                    scope.sanitizedContent = $sce.trustAsHtml(converter.makeHtml(scope.content));
                };

                scope.$watch("content", run);

                run();

                var newElementHtml = "<p ng-bind-html='sanitizedContent'></p>";
                var newElement = $compile(newElementHtml)(scope);

                element.append(newElement);
            }
        }
    }]);
