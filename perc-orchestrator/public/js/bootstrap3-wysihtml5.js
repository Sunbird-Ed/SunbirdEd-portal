!function($, wysi) {
    "use strict";

    var tpl = {
        "font-styles": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='dropdown wysihtml5-toolbar-fontStyles'>" +
                    "<a class='btn dropdown-toggle " + size + " btn-default' data-toggle='dropdown' href='#'>" +
                        "<i class='glyphicon glyphicon-font'></i>&nbsp;<span class='current-font'>" + locale.font_styles.normal + "</span>&nbsp;<b class='caret'></b>" +
                    "</a>" +
                    "<ul class='dropdown-menu'>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div' tabindex='-1'>" + locale.font_styles.normal + "</a></li>" +
                        "<li role='presentation' class='divider'></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1' tabindex='-1'><h1>" + locale.font_styles.h1 + "</h1></a></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2' tabindex='-1'><h2>" + locale.font_styles.h2 + "</h2></a></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h3' tabindex='-1'><h3>" + locale.font_styles.h3 + "</h3></a></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h4' tabindex='-1'><h4>" + locale.font_styles.h4 + "</h4></a></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h5' tabindex='-1'><h5>" + locale.font_styles.h5 + "</h5></a></li>" +
                        "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h6' tabindex='-1'><h6>" + locale.font_styles.h6 + "</h6></a></li>" +
                    "</ul>" +
                "</li>";
        },

        "color": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='dropdown wysihtml5-toolbar-color'>" +
                    "<a class='btn dropdown-toggle " + size + " btn-default' data-toggle='dropdown' href='#' tabindex='-1'>" +
                        "<span class='current-color'>" + locale.colours.black + "</span>&nbsp;<b class='caret'></b>" +
                    "</a>" +
                    "<ul class='dropdown-menu'>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='black'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='black'>" + locale.colours.black + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='silver'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='silver'>" + locale.colours.silver + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='gray'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='gray'>" + locale.colours.gray + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='maroon'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='maroon'>" + locale.colours.maroon + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='red'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='red'>" + locale.colours.red + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='purple'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='purple'>" + locale.colours.purple + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='green'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='green'>" + locale.colours.green + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='olive'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='olive'>" + locale.colours.olive + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='navy'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='navy'>" + locale.colours.navy + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='blue'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='blue'>" + locale.colours.blue + "</a></li>" +
                        "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='orange'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='orange'>" + locale.colours.orange + "</a></li>" +
                    "</ul>" +
                "</li>";
        },

        "emphasis": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-emphasis'>" +
                    "<div class='btn-group'>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='bold' title='" + locale.emphasis.bold + " (CTRL+B)' tabindex='-1'><i class='glyphicon glyphicon-bold'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='italic' title='" + locale.emphasis.italic + " (CTRL+I)' tabindex='-1'><i class='glyphicon glyphicon-italic'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='underline' title='" + locale.emphasis.underline + " (CTRL+U)' tabindex='-1'><b><u>U</u></b></a>" +
                    "</div>" +
                "</li>";
        },

        "textAlign": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-textAlign'>" +
                    "<div class='btn-group'>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='justifyLeft' title='" + locale.text.alignLeft + "' tabindex='-1'><i class='glyphicon glyphicon-align-left'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='justifyCenter' title='" + locale.text.alignCenter + "' tabindex='-1'><i class='glyphicon glyphicon-align-center'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='justifyFull' title='" + locale.text.alignJustify + "' tabindex='-1'><i class='glyphicon glyphicon-align-justify'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='justifyRight' title='" + locale.text.alignRight + "' tabindex='-1'><i class='glyphicon glyphicon-align-right'></i></a>" +
                    "</div>" +
                "</li>";
        },

        "lists": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-lists'>" +
                    "<div class='btn-group'>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='insertUnorderedList' title='" + locale.lists.unordered + "' tabindex='-1'><i class='glyphicon glyphicon-list'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='insertOrderedList' title='" + locale.lists.ordered + "' tabindex='-1'><i class='glyphicon glyphicon-th-list'></i></a>" +
                        "<a class='btn " + size + " btn-default' data-wysihtml5-command='Outdent' title='" + locale.lists.outdent + "' tabindex='-1'><i class='glyphicon glyphicon-indent-right'></i></a>" +
                        "<a class='btn -" + size + " btn-default' data-wysihtml5-command='Indent' title='" + locale.lists.indent + "' tabindex='-1'><i class='glyphicon glyphicon-indent-left'></i></a>" +
                    "</div>" +
                "</li>";
        },

        "blockquote": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-blockquote'>" +
                    "<a class='btn " + size + " btn-default' data-wysihtml5-command='insertBlockQuote' title='" + locale.text.blockquote + "' tabindex='-1'><i style='font-weight:bold;'>„”</i></a>" +
                "</li>";
        },

        "link": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-link'>" +
                    "<div class='bootstrap-wysihtml5-insert-link-modal modal fade'>" +
                        "<div class='modal-dialog'>"+
                            "<div class='modal-content'>"+
                                "<div class='modal-header'>" +
                                    "<button type='button' class='close' data-dismiss='modal'>" +
                                        "<span aria-hidden='true'>×</span>" +
                                        "<span class='sr-only'>Close</span>" +
                                    "</button>" +
                                    "<h4 class='modal-title'>" + locale.link.insert + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                    "<input placeholder='http://' class='bootstrap-wysihtml5-insert-link-url form-control'>" +
                                    "<label class='checkbox' style='margin-left:20px;'> <input type='checkbox' class='bootstrap-wysihtml5-insert-link-target' checked>" + locale.link.target + "</label>" +
                                    "<br/>" +
                                    "<div class='alert alert-danger' style='visibility:hidden;' role='alert'>" + locale.link.invalid + "</div>" +
                                "</div>" +
                                "<div class='modal-footer'>" +
                                    "<button type='button' class='btn btn-default' data-dismiss='modal'>" + locale.link.cancel + "</button>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<button type='button' class='btn " + size + " btn-default' title='" + locale.link.insert + "' tabindex='-1' data-toggle='modal' data-target='.bootstrap-wysihtml5-insert-link-modal'><i class='glyphicon glyphicon-share'></i></button>" +
                "</li>";
        },

        "table": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-table'>" +
                    "<div class='bootstrap-wysihtml5-insert-table-modal modal fade'>" +
                        "<div class='modal-dialog'>"+
                            "<div class='modal-content'>"+
                                "<div class='modal-header'>" +
                                    "<button type='button' class='close' data-dismiss='modal'>" +
                                        "<span aria-hidden='true'>×</span>" +
                                        "<span class='sr-only'>Close</span>" +
                                    "</button>" +
                                    "<h4 class='modal-title'>" + locale.table.insert + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                    "<div class='row'>" +
                                        "<div class='form-group col-sm-4'>" +
                                            "<label class='control-label'>" +
                                                locale.table.rows +
                                                "<input type='number' class='form-control wysihtml5-table-rows' value='3' min='1'>" +
                                            "</label>" +
                                        "</div>" +
                                        "<div class='form-group col-sm-4'>" +
                                            "<label class='control-label'>" +
                                                locale.table.columns +
                                                "<input type='number' class='form-control wysihtml5-table-cols' value='3' min='1'>" +
                                            "</label>" +
                                        "</div>" +
                                        "<div class='form-group col-sm-4'>" +
                                            "<label class='control-label' style='width:100%;position:relative;'>" +
                                                "<span>" + locale.table.heading.label + "</span>" +
                                                "<button type='button' class='btn btn-default dropdown-toggle form-control' data-toggle='dropdown'>" +
                                                    "<span class='current-heading' data-index='0'>" + locale.table.heading.none + "</span>&nbsp;<b class='caret'></b>" +
                                                "</button>" +
                                                "<ul class='dropdown-menu' style='right:0;'>" +
                                                    "<li><a class='wysihtml5-table-heading' tabindex='-1' href='javascript:;' unselectable='on' data-index='0'>" + locale.table.heading.none + "</a></li>" +
                                                    "<li><a class='wysihtml5-table-heading' tabindex='-1' href='javascript:;' unselectable='on' data-index='1'>" + locale.table.heading.row + "</a></li>" +
                                                    "<li><a class='wysihtml5-table-heading' tabindex='-1' href='javascript:;' unselectable='on' data-index='2'>" + locale.table.heading.column + "</a></li>" +
                                                "</ul>" +
                                        "</div>" +
                                    "</div>" +
                                    "<br/>" +
                                    "<div class='alert alert-danger' style='visibility:hidden;' role='alert'>" + locale.table.invalid + "</div>" +
                                "</div>" +
                                "<div class='modal-footer'>" +
                                    "<button type='button' class='btn btn-default' data-dismiss='modal'>" + locale.table.cancel + "</button>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>" + locale.table.insert + "</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<button type='button' class='btn " + size + " btn-default' title='" + locale.table.insert + "' tabindex='-1' data-toggle='modal' data-target='.bootstrap-wysihtml5-insert-table-modal'><i class='glyphicon glyphicon-th'></i></button>" +
                "</li>";
        },

        "image": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-image'>" +
                    "<div class='bootstrap-wysihtml5-insert-image-modal modal fade'>" +
                        "<div class='modal-dialog'>"+
                            "<div class='modal-content'>"+
                                "<div class='modal-header'>" +
                                    "<button type='button' class='close' data-dismiss='modal'>" +
                                        "<span aria-hidden='true'>×</span>" +
                                        "<span class='sr-only'>Close</span>" +
                                    "</button>" +
                                    "<h4 class='modal-title'>" + locale.image.insert + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                    "<div class='input-group'>" +
                                        "<input type='file' class='hidden bootstrap-wysihtml5-insert-image-file'>" +
                                        "<input type='hidden'/>" +
                                        "<input placeholder='http://' class='bootstrap-wysihtml5-insert-image-url form-control'>" +
                                        "<div class='input-group-btn'>" +
                                            "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" + locale.image.fromUrl + " <span class='caret'></span></button>" +
                                            "<ul class='dropdown-menu dropdown-menu-right' role='menu' style='right:0;left:auto;'>" +
                                                "<li><a href='#' class='bootstrap-wysihtml5-insert-image-local'>" + locale.image.fromComputer + "</a></li>" +
                                            "</ul>" +
                                        "</div>" +
                                    "</div>" +
                                    "<br/>" +
                                    "<div class='alert alert-danger' style='visibility:hidden;' role='alert'></div>" +
                                "</div>" +
                                "<div class='modal-footer'>" +
                                    "<button type='button' class='btn btn-default' data-dismiss='modal'>" + locale.image.cancel + "</button>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>" + locale.image.insert + "</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<button type='button' class='btn " + size + " btn-default' title='" + locale.image.insert + "' tabindex='-1' data-toggle='modal' data-target='.bootstrap-wysihtml5-insert-image-modal'><i class='glyphicon glyphicon-picture'></i></button>" +
                "</li>";
        },

        "video": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li class='wysihtml5-toolbar-video'>" +
                    "<div class='bootstrap-wysihtml5-insert-video-modal modal fade'>" +
                        "<div class='modal-dialog'>"+
                            "<div class='modal-content'>"+
                                "<div class='modal-header'>" +
                                    "<button type='button' class='close' data-dismiss='modal'>" +
                                        "<span aria-hidden='true'>×</span>" +
                                        "<span class='sr-only'>Close</span>" +
                                    "</button>" +
                                    "<h4 class='modal-title'>" + locale.video.insert + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                    "<input type='text' data-wysihtml5-dialog-field='src' placeholder='https://' class='bootstrap-wysihtml5-insert-video-url form-control'>" +
                                    "<br/>" +
                                    "<div class='btn-group bootstrap-wysihtml5-insert-video-format' data-toggle='buttons'>" +
                                        "<label class='btn btn-default active' title='" + locale.video.widescreen + "'>" +
                                            "<input type='radio' data-value='wide' name='options'checked> 16:9" +
                                        "</label>" +
                                        "<label class='btn btn-default' title='" + locale.video.tv + "'>" +
                                            "<input type='radio' data-value='tv' name='options'> &nbsp;4:3&nbsp;" +
                                        "</label>" +
                                    "</div>" +
                                    "<i class='glyphicon glyphicon-question-sign pull-right' title='" + locale.video.supported + ": &#10;YouTube, &#10;Vimeo, &#10;Metacafe, &#10;DailyMotion, &#10;Vbox7'></i>" +
                                    "<br/><br/>" +
                                    "<div class='alert alert-danger' style='visibility:hidden;' role='alert'>" + locale.video.invalid + "</div>" +
                                "</div>" +
                                "<div class='modal-footer'>" +
                                    "<button type='button' class='btn btn-default' data-dismiss='modal'>" + locale.video.cancel + "</button>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>" + locale.video.insert + "</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<button type='button' class='btn " + size + " btn-default' title='" + locale.video.insert + "' tabindex='-1' data-toggle='modal' data-target='.bootstrap-wysihtml5-insert-video-modal'><i class='glyphicon glyphicon-facetime-video'></i></button>" +
                "</li>";
        },

        "html": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "" +
                "<li>" +
                    "<button type='button' class='btn " + size + " btn-danger' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><b style='letter-spacing:1px;'>&lt;/&gt;</b></button>" +
                "</li>";
        }
    };

    var templates = function(key, locale, options) {
        try {
            return tpl[key](locale, options);
        } catch(e) { return ""; } //prevent accidental 'true' values being rendered as toolbar items
    };


    var Wysihtml5 = function(el, options) {
        this.el = el;
        var toolbarOpts = options || defaultOptions;
        for(var t in toolbarOpts.customTemplates) {
            tpl[t] = toolbarOpts.customTemplates[t];
        }
        this.toolbar = this.createToolbar(el, toolbarOpts);
        this.editor =  this.createEditor(options);

        window.editor = this.editor;

        $('iframe.wysihtml5-sandbox').each(function(i, el){
            $(el.contentWindow).off('focus.wysihtml5').on({
                'focus.wysihtml5' : function(){
                    $('li.dropdown').removeClass('open');
                }
            });
        });
    };

    Wysihtml5.prototype = {

        constructor: Wysihtml5,

        createEditor: function(options) {
            options = options || {};

            // Add the toolbar to a clone of the options object so multiple instances
            // of the WYISYWG don't break because "toolbar" is already defined
            options = $.extend(true, {}, options);
            options.toolbar = this.toolbar[0];

            var editor = new wysi.Editor(this.el[0], options);

            if(options && options.events) {
                for(var eventName in options.events) {
                    editor.on(eventName, options.events[eventName]);
                }
            }
            return editor;
        },

        createToolbar: function(el, options) {
            var self = this;
            var toolbar = $("<ul/>", {
                'class' : "wysihtml5-toolbar",
                'style': "display:none"
            });
            var culture = options.locale || defaultOptions.locale || "en";
            for(var key in defaultOptions) {
                var value = false;

                if(options[key] !== undefined) {
                    if(options[key] === true) {
                        value = true;
                    }
                } else {
                    value = defaultOptions[key];
                }

                if(value === true) {
                    toolbar.append(templates(key, locale[culture], options));

                    if(key === "html") {
                        this.initHtml(toolbar);
                    }

                    if(key === "link") {
                        this.initInsertLink(toolbar);
                    }

                    if(key === "table") {
                        this.initInsertTable(toolbar);
                    }

                    if(key === "image") {
                        this.initInsertImage(toolbar, culture);
                    }

                    if(key === "video") {
                        this.initInsertVideo(toolbar);
                    }
                }
            }

            if(options.useParserRules === false) {
                options.parser = function parse(elementOrHtml, config) {
                    return elementOrHtml;
                };
            }

            if(options.toolbar) {
                for(key in options.toolbar) {
                    toolbar.append(options.toolbar[key]);
                }
            }

            toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                self.toolbar.find('.current-font').text(el.html());
            });

            toolbar.find("a[data-wysihtml5-command='foreColor']").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                self.toolbar.find('.current-color').text(el.html());
            });

            this.el.before(toolbar);

            return toolbar;
        },

        initHtml: function(toolbar) {
            var changeViewSelector = "[data-wysihtml5-action='change_view']";
            toolbar.find(changeViewSelector).click(function(e) {
                toolbar.find('.btn').not(changeViewSelector).toggleClass('disabled');
            });
        },

        initInsertImage: function(toolbar, culture) {
            var self = this;
            var insertImageModal = toolbar.find('.bootstrap-wysihtml5-insert-image-modal');
            var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
            var localInputButton = insertImageModal.find('.bootstrap-wysihtml5-insert-image-local');
            var localInputFile = insertImageModal.find('.bootstrap-wysihtml5-insert-image-file');
            var insertButton = insertImageModal.find('.btn-primary');
            var initialValue = urlInput.val();
            var errorMsg = insertImageModal.find('.alert-danger');
            var caretBookmark;

            var insertImage = function() {
                var url = urlInput.val();
                urlInput.val(initialValue);
                self.editor.currentView.element.focus();
                if (caretBookmark) {
                    self.editor.composer.selection.setBookmark(caretBookmark);
                    caretBookmark = null;
                }

                if(url) {
                    self.editor.composer.commands.exec("insertImage", { src: url, class: "img-responsive" });
                }
                else {
                    errorMsg.css('visibility', "visible");
                    errorMsg.text(locale[culture].image.invalid);
                    return false;
                }
            };

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertImage();
                    insertImageModal.modal('hide');
                    return false;
                }
            });

            insertButton.click(insertImage);

            localInputButton.click(function(){localInputFile.trigger("click");});

            localInputFile.change(function(event){
                insertButton.prop("disabled", true);
                var file = event.target.files[0],
                    reader = new FileReader();
                if (!file.type.match('image.*')) return;
                reader.onload = function(event) {
                    if (caretBookmark) {
                        self.editor.composer.selection.setBookmark(caretBookmark);
                        caretBookmark = null;
                    }

                    insertImageModal.modal('hide');
                    self.editor.composer.commands.exec("insertImage", {
                        alt: file.name,
                        title: file.name,
                        src: event.target.result,
                        class: "img-responsive"
                    });
                    insertButton.prop("disabled", false);
                };
                reader.onerror = function(event) {
                    errorMsg.css('visibility', "visible");
                    errorMsg.text(event.target.error.code + ": " + locale[culture].image.error);
                };
                reader.readAsDataURL(file);
            });

            insertImageModal.on('shown.bs.modal', function() {
                urlInput.focus();
            });

            insertImageModal.on('hidden.bs.modal', function() {
                errorMsg.css('visibility', "hidden");
                urlInput.val('');
                insertImageModal.find(".input-group-btn.open").removeClass('open');
                setTimeout(function(){self.editor.currentView.element.focus();});
            });
        },

        initInsertVideo: function(toolbar) {
            var self = this;
            var insertVideoModal = toolbar.find('.bootstrap-wysihtml5-insert-video-modal');
            var urlInput = insertVideoModal.find('.bootstrap-wysihtml5-insert-video-url');
            var insertButton = insertVideoModal.find('.btn-primary');
            var initialValue = urlInput.val();
            var errorMsg = insertVideoModal.find('.alert-danger');
            var caretBookmark;

            var insertVideo = function() {
                errorMsg.css('visibility', "hidden");
                var linkUrl = urlInput.val();
                var embedUrl = false;

                if (/^(https?\:\/\/(www\.)?(m\.)?youtube.com\/)/i.test(linkUrl) || /^(https?\:\/\/(www\.)?youtu.be\/)/i.test(linkUrl)) {
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                    var match = linkUrl.match(regExp);
                    if ( match && match[7].length == 11 ){
                        embedUrl = match[7];
                        embedUrl = '//www.youtube.com/embed/' + embedUrl;
                    }
                } else if(/^(https?\:\/\/(www\.)?(player\.)?vimeo.com\/)/i.test(linkUrl)) {
                    embedUrl = '//player.vimeo.com/video/' + linkUrl.split("/").pop() + "?title=0&byline=0&portrait=0&badge=0";
                } else if(/^(https?\:\/\/(www\.)?dailymotion.com\/)/i.test(linkUrl)) {
                    embedUrl = linkUrl.replace("/video/", "/embed/video/");
                } else if(/^(https?\:\/\/(www\.)?vbox7.com\/play:)/i.test(linkUrl)) {
                    embedUrl = linkUrl.replace("/play:", "/emb/external.php?vid=");
                } else if(/^(https?\:\/\/(www\.)?metacafe.com\/w(atch)?)/i.test(linkUrl)) {
                    embedUrl = linkUrl.replace(/\/w(atch)?\//, "embed");
                }

                if(embedUrl) {
                    var format = insertVideoModal.find(".bootstrap-wysihtml5-insert-video-format input:checked").data("value");
                    self.editor.currentView.element.focus();
                    if (caretBookmark) {
                        self.editor.composer.selection.setBookmark(caretBookmark);
                        caretBookmark = null;
                    }
                    self.editor.composer.commands.exec("insertVideo", embedUrl, format);
                    urlInput.val('');
                } else {
                    errorMsg.css('visibility', "visible");
                    return false;
                }
            };

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertVideo();
                    insertVideoModal.modal('hide');
                    return false;
                }
            });

            insertButton.click(insertVideo);

            insertVideoModal.on('shown.bs.modal', function() {
                urlInput.focus();
            });

            insertVideoModal.on('hidden.bs.modal', function() {
                errorMsg.css('visibility', "hidden");
                urlInput.val('');
                setTimeout(function(){self.editor.currentView.element.focus();});
            });
        },

        initInsertLink: function(toolbar) {
            var self = this;
            var insertLinkModal = toolbar.find('.bootstrap-wysihtml5-insert-link-modal');
            var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
            var targetInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-target');
            var insertButton = insertLinkModal.find('.btn-primary');
            var initialValue = urlInput.val();
            var errorMsg = insertLinkModal.find('.alert-danger');
            var caretBookmark;

            function validateURL(URL) {
                return URL && (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i).test(URL);
            }

            var insertLink = function() {
                var url = urlInput.val();
                urlInput.val(initialValue);
                self.editor.currentView.element.focus();
                if (caretBookmark) {
                    self.editor.composer.selection.setBookmark(caretBookmark);
                    caretBookmark = null;
                }

                if(validateURL(url)) {
                    var newWindow = targetInput.prop("checked");
                    self.editor.composer.commands.exec("createLink", {
                        'href' : url,
                        'target' : (newWindow ? '_blank' : '_self'),
                        'rel' : (newWindow ? 'nofollow' : '')
                    });
                }
                else {
                    errorMsg.css('visibility', "visible");
                    return false;
                }
            };
            var pressedEnter = false;

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertLink();
                    insertLinkModal.modal('hide');
                    return false;
                }
            });

            insertButton.click(insertLink);

            insertLinkModal.on('shown.bs.modal', function() {
                urlInput.focus();
            });

            insertLinkModal.on('hidden.bs.modal', function() {
                errorMsg.css('visibility', "hidden");
                urlInput.val('');
                setTimeout(function(){self.editor.currentView.element.focus();});
            });
        },

        initInsertTable: function(toolbar) {
            var self = this,
                insertTableModal = toolbar.find('.bootstrap-wysihtml5-insert-table-modal'),
                rowsInput = insertTableModal.find('.wysihtml5-table-rows'),
                colsInput = insertTableModal.find('.wysihtml5-table-cols'),
                headingInput = insertTableModal.find('.current-heading'),
                insertButton = insertTableModal.find('.btn-primary'),
                rowsInitialValue = rowsInput.val(),
                colsInitialValue = colsInput.val(),
                errorMsg = insertTableModal.find('.alert-danger'),
                caretBookmark;

            var insertTable = function() {
                var rows = rowsInput.val(),
                    cols = colsInput.val(),
                    heading = headingInput.attr("data-index");
                if(heading == 1) heading = "rows";
                else if(heading == 2) heading = "cols";
                rowsInput.val(rowsInitialValue);
                colsInput.val(colsInitialValue);
                self.editor.currentView.element.focus();
                if (caretBookmark) {
                    self.editor.composer.selection.setBookmark(caretBookmark);
                    caretBookmark = null;
                }

                if(!isNaN(rows) && !isNaN(cols) && rows > 0 && cols > 0) {
                    self.editor.composer.commands.exec("createTable", {
                        rows: rows,
                        cols: cols,
                        heading: heading
                    });
                }
                else {
                    errorMsg.css('visibility', "visible");
                    return false;
                }
            };
            var pressedEnter = false;

            rowsInput.keypress(function(e) {
                if(e.which == 13) {
                    colsInput.focus();
                    return false;
                }
            });

            colsInput.keypress(function(e) {
                if(e.which == 13) {
                    insertTable();
                    insertTableModal.modal('hide');
                    return false;
                }
            });

            insertTableModal.find(".wysihtml5-table-heading").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                insertTableModal.find('.current-heading').text(el.html()).attr("data-index", el.attr("data-index"));
            });

            insertButton.click(insertTable);

            insertTableModal.on('shown.bs.modal', function() {
                rowsInput.focus();
            });

            insertTableModal.on('hidden.bs.modal', function() {
                errorMsg.css('visibility', "hidden");
                rowsInput.val(rowsInitialValue);
                colsInput.val(colsInitialValue);
                headingInput.text(insertTableModal.find(".wysihtml5-table-heading[data-index=0]").text());
                headingInput.attr("data-index", 0);
                headingInput.closest('.control-label').removeClass('open');
                setTimeout(function(){self.editor.currentView.element.focus();});
            });
        }
    };

    // these define our public api
    var methods = {
        resetDefaults: function() {
            $.fn.wysihtml5.defaultOptions = $.extend(true, {}, $.fn.wysihtml5.defaultOptionsCache);
        },
        bypassDefaults: function(options) {
            return this.each(function () {
                var $this = $(this);
                $this.data('wysihtml5', new Wysihtml5($this, options));
            });
        },
        shallowExtend: function (options) {
            var settings = $.extend({}, $.fn.wysihtml5.defaultOptions, options || {}, $(this).data());
            var that = this;
            return methods.bypassDefaults.apply(that, [settings]);
        },
        deepExtend: function(options) {
            var settings = $.extend(true, {}, $.fn.wysihtml5.defaultOptions, options || {});
            var that = this;
            return methods.bypassDefaults.apply(that, [settings]);
        },
        init: function(options) {
            var that = this;
            return methods.shallowExtend.apply(that, [options]);
        }
    };

    $.fn.wysihtml5 = function ( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.wysihtml5' );
        }
    };

    $.fn.wysihtml5.Constructor = Wysihtml5;

    var defaultOptions = $.fn.wysihtml5.defaultOptions = {
        "useLineBreaks": false,
        "autoLink": true,
        "supportTouchDevices": true,
        "cleanUp": true,
        "size": 'sm',
        //Toolbar items
        "font-styles": true,
        "color": true,
        "emphasis": true,
        "textAlign": false,
        "lists": true,
        "blockquote": false,
        "link": true,
        "table": true,
        "image": true,
        "video": false,
        "html": false,
        events: {},
        parserRules: {
            classes: {
                "wysiwyg-font-size-smaller": 1,
                "wysiwyg-font-size-larger": 1,
                "wysiwyg-font-size-xx-large": 1,
                "wysiwyg-font-size-x-large": 1,
                "wysiwyg-font-size-large": 1,
                "wysiwyg-font-size-medium": 1,
                "wysiwyg-font-size-small": 1,
                "wysiwyg-font-size-x-small": 1,
                "wysiwyg-font-size-xx-small": 1,
                "wysiwyg-text-align-right": 1,
                "wysiwyg-text-align-center": 1,
                "wysiwyg-text-align-left": 1,
                "wysiwyg-text-align-justify": 1,
                "wysiwyg-float-left": 1,
                "wysiwyg-float-right": 1,
                "wysiwyg-clear-right": 1,
                "wysiwyg-clear-left": 1,
                "wysiwyg-color-silver" : 1,
                "wysiwyg-color-gray" : 1,
                "wysiwyg-color-white" : 1,
                "wysiwyg-color-maroon" : 1,
                "wysiwyg-color-red" : 1,
                "wysiwyg-color-purple" : 1,
                "wysiwyg-color-fuchsia" : 1,
                "wysiwyg-color-green" : 1,
                "wysiwyg-color-lime" : 1,
                "wysiwyg-color-olive" : 1,
                "wysiwyg-color-yellow" : 1,
                "wysiwyg-color-navy" : 1,
                "wysiwyg-color-blue" : 1,
                "wysiwyg-color-teal" : 1,
                "wysiwyg-color-aqua" : 1,
                "wysiwyg-color-orange" : 1,
                "embed-responsive": 1,
                "embed-responsive-16by9": 1,
                "embed-responsive-item": 1,
                "img-responsive": 1
            },
            /*type_definitions: {
                "visible_content_object": {
                    "methods": {
                        "has_visible_contet": 1
                    }
                },

                "alignment_object": {
                    "classes": {
                        "wysiwyg-text-align-center": 1,
                        "wysiwyg-text-align-justify": 1,
                        "wysiwyg-text-align-left": 1,
                        "wysiwyg-text-align-right": 1,
                        "wysiwyg-float-left": 1,
                        "wysiwyg-float-right": 1
                    },
                    "styles": {
                        "float": ["left", "right"],
                        "text-align": ["left", "right", "center"]
                    }
                },

                "valid_image_src": {
                    "attrs": {
                        "src": /^[^data\:]/i
                    }
                },

                "text_color_object": {
                  "styles": {
                    "color": true,
                    "background-color": true
                  }
                },

                "text_fontsize_object": {
                  "styles": {
                    "font-size": true
                  }
                },

                "text_formatting_object": {
                    "classes": {
                        "wysiwyg-color-aqua": 1,
                        "wysiwyg-color-black": 1,
                        "wysiwyg-color-blue": 1,
                        "wysiwyg-color-fuchsia": 1,
                        "wysiwyg-color-gray": 1,
                        "wysiwyg-color-green": 1,
                        "wysiwyg-color-lime": 1,
                        "wysiwyg-color-maroon": 1,
                        "wysiwyg-color-navy": 1,
                        "wysiwyg-color-olive": 1,
                        "wysiwyg-color-purple": 1,
                        "wysiwyg-color-red": 1,
                        "wysiwyg-color-silver": 1,
                        "wysiwyg-color-teal": 1,
                        "wysiwyg-color-white": 1,
                        "wysiwyg-color-yellow": 1,
                        "wysiwyg-font-size-large": 1,
                        "wysiwyg-font-size-larger": 1,
                        "wysiwyg-font-size-medium": 1,
                        "wysiwyg-font-size-small": 1,
                        "wysiwyg-font-size-smaller": 1,
                        "wysiwyg-font-size-x-large": 1,
                        "wysiwyg-font-size-x-small": 1,
                        "wysiwyg-font-size-xx-large": 1,
                        "wysiwyg-font-size-xx-small": 1
                    }
                }
            },*/
            tags: {
                "b":  {},
                "i":  {},
                "br": {},
                "ol": {},
                "ul": {},
                "li": {},
                "h1": {},
                "h2": {},
                "h3": {},
                "h4": {},
                "h5": {},
                "h6": {},
                "blockquote": {},
                "u": 1,
                "img": {
                    "check_attributes": {
                        "width": "numbers",
                        "alt": "alt",
                        "src": "any", /* Needed for data:image/jpeg;base64 type */
                        "height": "numbers",
                        "title": "alt"
                    }
                },
                "a":  {
                    check_attributes: {
                        'href': "src", // use 'url' to avoid XSS
                        'target': 'alt',
                        'rel': 'alt'
                    }
                },
                "iframe": {
                    "check_attributes": {
                        "src":"any",
                        "width":"numbers",
                        "height":"numbers"
                    },
                    "set_attributes": {
                        "frameborder":"0"
                    }
                },
                "p": 1,
                "span": 1,
                "div": 1,
                "table": 1,
                "tbody": 1,
                "thead": 1,
                "tfoot": 1,
                "tr": 1,
                "th": 1,
                "td": 1,
                // to allow save and edit files with code tag hacks
                "code": 1,
                "pre": 1,
                "style": 1
            }
        },
        stylesheets: ["/css/bootstrap3-wysihtml5-editor.css"],
        locale: "en"
    };

    if (typeof $.fn.wysihtml5.defaultOptionsCache === 'undefined') {
        $.fn.wysihtml5.defaultOptionsCache = $.extend(true, {}, $.fn.wysihtml5.defaultOptions);
    }

    var locale = $.fn.wysihtml5.locale = {
        en: {
            font_styles: {
                normal: "Normal text",
                h1: "Heading 1",
                h2: "Heading 2",
                h3: "Heading 3",
                h4: "Heading 4",
                h5: "Heading 5",
                h6: "Heading 6"
            },
            text: {
                alignLeft: "Align left",
                alignCenter: "Align center",
                alignJustify: "Justify",
                alignRight: "Align right",
                blockquote: "Blockquote"
            },
            emphasis: {
                bold: "Bold",
                italic: "Italic",
                underline: "Underline"
            },
            lists: {
                unordered: "Unordered list",
                ordered: "Ordered list",
                outdent: "Outdent",
                indent: "Indent"
            },
            link: {
                insert: "Insert link",
                cancel: "Cancel",
                target: "Open link in new window",
                invalid: "Invalid link URL"
            },
            table: {
                insert: "Insert table",
                cancel: "Cancel",
                rows: "Rows",
                columns: "Columns",
                heading: {
                    label: "Heading",
                    none: "None",
                    row: "First row",
                    column: "First column"
                },
                invalid: "Invalid table rows/columns"
            },
            image: {
                insert: "Insert image",
                cancel: "Cancel",
                fromUrl: "From URL",
                fromComputer: "From local file",
                invalid: "Invalid image URL",
                error: "An error occurred reading this file"
            },
            video: {
                insert: "Insert Video",
                cancel: "Cancel",
                widescreen: "Widescreen",
                tv: "TV",
                supported: "Supported video formats",
                invalid: "Invalid video URL"
            },
            html: {
                edit: "Edit HTML"
            },
            colours: {
                black: "Black",
                silver: "Silver",
                gray: "Grey",
                maroon: "Maroon",
                red: "Red",
                purple: "Purple",
                green: "Green",
                olive: "Olive",
                navy: "Navy",
                blue: "Blue",
                orange: "Orange"
            }
        }
    };

}(window.jQuery, window.wysihtml5);

/**
 * Insert Video Functions
 */

(function(wysihtml5) {
    var NODE_NAME = "";

    wysihtml5.commands.insertVideo = {
        /**
         * @example
         * wysihtml5.commands.insertVideo.exec(composer, 'insertVideo', 'http://www.youtube.com/embed/Hx_rRirV2vc');
         */
        exec: function(composer, command, src, format) {
            var doc = composer.doc,
                wrapper,
                video = this.state(composer),
                i,
                parent;

            if (video) {
                // Video already selected, set the caret before it and delete it
                composer.selection.setBefore(video);
                parent = video.parentNode;
                parent.removeChild(video);

                // and it's parent <a> too if it hasn't got any other relevant child nodes
                wysihtml5.dom.removeEmptyTextNodes(parent);
                if (parent.nodeName === "A" && !parent.firstChild) {
                    composer.selection.setAfter(parent);
                    parent.parentNode.removeChild(parent);
                }

                // firefox and ie sometimes don't remove the video handles, even though the video was removed
                wysihtml5.quirks.redraw(composer.element);
                return;
            }

            wrapper = doc.createElement("DIV");
            video = doc.createElement("IFRAME");
            wrapper.className = "embed-responsive " + ((format == "tv")? "embed-responsive-4by3" : "embed-responsive-16by9");
            video.className = "embed-responsive-item";
            wrapper.appendChild(video);

            video.src = src;
            video.setAttribute('allowFullScreen', '');
            composer.selection.insertNode(wrapper);
            if (wysihtml5.browser.hasProblemsSettingCaretAfterImg()) {
                textNode = doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
                composer.selection.insertNode(textNode);
                composer.selection.setAfter(textNode);
            } else {
                composer.selection.setAfter(wrapper);
            }

        },

        state: function(composer) {
            var doc = composer.doc,
                selectedNode,
                text,
                videosInSelection;

            if (!wysihtml5.dom.hasElementWithTagName(doc, NODE_NAME)) {
                return false;
            }

            selectedNode = composer.selection.getSelectedNode(doc);
            if (!selectedNode) {
                return false;
            }

            if (selectedNode.nodeName === NODE_NAME) {
                // This works perfectly in IE
                return selectedNode;
            }

            if (selectedNode.nodeType !== wysihtml5.ELEMENT_NODE) {
                return false;
            }

            text = composer.selection.getText(doc);
            text = wysihtml5.lang.string(text).trim();
            if (text) {
                return false;
            }

            videosInSelection = composer.selection.getNodes(doc, wysihtml5.ELEMENT_NODE, function(node) {
                return node.nodeName === "IFRAME";
            });

            if (videosInSelection.length !== 1) {
                return false;
            }

            return videosInSelection[0];
        },

        value: function(composer) {
            var video = this.state(composer);
            return video && video.src;
        }
    };

    wysihtml5.commands.createTable.exec = function(composer, command, value) {
        var col, row, heading, html;
        if (value && value.cols && value.rows && parseInt(value.cols, 10) > 0 && parseInt(value.rows, 10) > 0) {
            if (value.tableStyle) {
                html = "<table style=\"" + value.tableStyle + "\">";
            } else {
                html = "<table>";
            }
            html += "<tbody>";
            for (row = 0; row < value.rows; row ++) {
                html += '<tr>';
                for (col = 0; col < value.cols; col ++) {
                    if(value.heading && value.heading == "rows" && row === 0) html += "<th>&nbsp;</th>";
                    else if(value.heading && value.heading == "cols" && col === 0) html += "<th>&nbsp;</th>";
                    else html += "<td>&nbsp;</td>";
                }
                html += '</tr>';
            }
            html += "</tbody></table>";
            composer.commands.exec("insertHTML", html);
          }
      };
}(wysihtml5));
