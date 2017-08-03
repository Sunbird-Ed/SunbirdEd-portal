var conceptModal;
(function() {
    $.fn.treePicker = function(options) {
        var actionButtons, config, count, initialize, initializeNodeList, initializeNodes, loadNodes, modal, nodeClicked, nodeIsPicked, nodes, pickNode, picked, recursiveNodeSearch, renderList, renderTree, showPicked, showSearch, showTree, tabs, unpickNode, updatePickedIds, updatePickedNodes, widget;
        widget = $(this);
        picked = [];
        nodes = [];
        tabs = {};
        $("#" + options.nodeName).length == 0 ? '' : $("#" + options.nodeName).remove();
        modal = $("<div id="+ options.nodeName +" class=\"ui tree-picker small modal\">\n  <div class=\"header\">\n    " + options.name + "\n\n    <div class=\"ui menu\">\n      <a class=\"active tree item\">\n        <i class=\"list icon\"></i> Concepts\n      </a>\n      <a class=\"picked item\">\n        <i class=\"checkmark icon\"></i> Selected Concepts <span class=\"count\"></span>\n      </a>\n    </div>\n  </div>\n  <div class=\"ui search form\">\n    <div class=\"field\">\n      <div class=\"ui icon input\">\n        <input type=\"text\" placeholder=\"Search\">\n        <i class=\"search icon\"></i>\n      </div>\n    </div>\n  </div>\n  <div class=\"content\">\n    <div class=\"ui active inverted dimmer\"><div class=\"ui text loader\">Loading data</div></div>\n    <div class=\"tree-tab\">\n      <div style=\"height: 400px\"></div>\n    </div>\n\n    <div class=\"search-tab\">\n    </div>\n\n    <div class=\"picked-tab\">\n    </div>\n  </div>\n  <div class=\"actions\">\n    <a class=\"pick-search\"><i class=\"checkmark icon\"></i> Choose All</a>\n    <a class=\"unpick-search\"><i class=\"remove icon\"></i> Remove All</a>\n    <a class=\"unpick-picked\"><i class=\"remove icon\"></i> Remove All</a>\n    <a class=\"ui blue button accept\">Done</a>\n    <a class=\"ui button close\">Cancel</a>\n  </div>\n</div>").modal({
            duration: 200,
            allowMultiple: true
        });
        conceptModal = modal;
        count = $('.count', modal);
        tabs = {
            tree: $('.tree-tab', modal),
            search: $('.search-tab', modal),
            picked: $('.picked-tab', modal)
        };
        actionButtons = {
            pickSearch: $('.actions .pick-search', modal),
            unpickSearch: $('.actions .unpick-search', modal),
            unpickPicked: $('.actions .unpick-picked', modal)
        };
        config = {
            childrenKey: 'nodes',
            singlePick: false,
            minSearchQueryLength: 3,
            hidden: function(node) {
                return false;
            },
            disabled: function(node) {
                return false;
            },
            displayFormat: function(picked) {
                return options.name + " (Выбрано " + picked.length + ")";
            }
        };
        $.extend(config, options);
        initialize = function() {
            console.log('Concept selector initializing....');
            if (config.data) {
                nodes = config.data;
            }
            if (config.picked) {
                config.picked = config.picked;
            } else if (widget.attr("data-picked-ids")) {
                widget.attr("data-picked-ids").split(",");
            }

            if (config.picked) {
                if (nodes.length) {
                    updatePickedNodes();
                    widget.html(config.displayFormat(picked));
                } else {
                    widget.html(config.displayFormat(config.picked));
                }
            } else {
                widget.html(config.displayFormat([]));
            }
            widget.unbind("click");
            widget.on('click', function(e) {
                console.log('click event received', nodes);
                modal.modal('show');
                if (!nodes.length) {
                    if (config.url) {
                        return loadNodes(config.url, {}, function(nodes) {
                            $('.ui.active.dimmer', modal).removeClass('active');
                            return initializeNodes(nodes);
                        });
                    }
                } else {
                    $('.ui.active.dimmer', modal).removeClass('active');
                    return initializeNodes(nodes);
                }
            });
            $('.actions .accept', modal).on('click', function(e) {
                modal.modal('hide');
                if (config.onSubmit) {
                    config.onSubmit(picked);
                }
                return widget.html(config.displayFormat(picked));
            });
            $('.actions .close', modal).on('click', function(e) {
                modal.modal('hide');
                if(config.onClose) {
                    config.onClose();
                }
            });
            actionButtons.pickSearch.on('click', function(e) {
                return $('.search-tab .node:not(.picked) .name').trigger('click');
            });
            actionButtons.unpickSearch.on('click', function(e) {
                return $('.search-tab .node.picked .name').trigger('click');
            });
            actionButtons.unpickPicked.on('click', function(e) {
                return $('.picked-tab .node.picked .name').trigger('click');
            });
            $('.menu .tree', modal).on('click', function(e) {
                return showTree();
            });
            $('.menu .picked', modal).on('click', function(e) {
                return showPicked();
            });
            console.log('Concept selector initialized');
            return $('.search input', modal).on('keyup', function(e) {
                return showSearch($(this).val());
            });
        };
        loadNodes = function(url, params, success) {
            if (params == null) {
                params = {};
            }
            return $.get(url, params, function(response) {
                if (response.constructor === String) {
                    nodes = $.parseJSON(response);
                } else {
                    nodes = response;
                }
                return success(nodes);
            });
        };
        initializeNodes = function(nodes) {
            var tree;
            updatePickedNodes();
            tree = renderTree(nodes, {
                height: '300px',
                overflowY: 'auto'
            });
            tabs.tree.html(tree);
            return initializeNodeList(tree);
        };
        updatePickedNodes = function() {
            var i, id, len, ref, results1, searchResult;
            if (config.picked) {
                picked = [];
                ref = config.picked;
                results1 = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    id = ref[i];
                    searchResult = recursiveNodeSearch(nodes, function(node) {
                        return ("" + node.id) === ("" + id);
                    });
                    if (searchResult.length) {
                        results1.push(picked.push(searchResult[0]));
                    } else {
                        results1.push(void 0);
                    }
                }
                return results1;
            }
        };
        showTree = function() {
            $('.menu .item', modal).removeClass('active');
            $('.menu .tree', modal).addClass('active');
            tabs.tree.show();
            tabs.search.hide();
            tabs.picked.hide();
            return modal.attr('data-mode', 'tree');
        };
        showSearch = function(query) {
            var foundNodes, list;
            var formatedNodes = [];
            if (query !== null && query.length >= config.minSearchQueryLength) {
                foundNodes = recursiveNodeSearch(nodes, function(node) {
                    return node.name && node.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
                });
                ecEditor._.forEach(foundNodes, function(value) {
                    if(value.selectable === 'selectable'){
                        formatedNodes.push(value);
                    }
                });
                foundNodes = formatedNodes;
                list = renderList(foundNodes, {
                    height: '400px',
                    overflowY: 'auto'
                });
                $('.menu .item', modal).removeClass('active');
                tabs.search.show().html(list);
                tabs.tree.hide();
                tabs.picked.hide();
                modal.attr('data-mode', 'search');
                initializeNodeList(list);
                return $('.name', list).each(function() {
                    var name, regex;
                    name = $(this).text();
                    regex = RegExp('(' + query + ')', 'gi');
                    name = name.replace(regex, "<strong class='search-query'>$1</strong>");
                    return $(this).html(name);
                });
            } else {
                return showTree();
            }
        };
        showPicked = function() {
            var list;
            list = renderList(picked, {
                height: '400px',
                overflowY: 'auto'
            });
            $('.menu .item', modal).removeClass('active');
            $('.menu .picked', modal).addClass('active');
            tabs.picked.show().html(list);
            tabs.tree.hide();
            tabs.search.hide();
            modal.attr('data-mode', 'picked');
            return initializeNodeListForSelected(list);
        };
        renderTree = function(nodes, css) {
            var i, len, node, nodeElement, tree;
            if (css == null) {
                css = {};
            }
            tree = $('<div class="ui tree-picker tree"></div>').css(css);
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                if (config.hidden(node)) {
                    continue;
                }
                nodeElement = $("<div class=\"node\" data-id=\"" + node.id + "\" data-name=\"" + node.name + "\">\n  <div class=\"head " + node.selectable + "\">\n    <i class=\"add circle icon\"></i>\n    <i class=\"minus circle icon\"></i>\n    <i class=\"radio icon\"></i>\n    <a class=\"name\">" + node.name + "</a>\n    <i class=\"checkmark icon\"></i>\n  </div>\n  <div class=\"content\"></div>\n</div>").appendTo(tree);
                if (config.disabled(node)) {
                    nodeElement.addClass('disabled');
                }
                if (node[config.childrenKey] && node[config.childrenKey].length) {
                    $('.content', nodeElement).append(renderTree(node[config.childrenKey]));
                } else {
                    nodeElement.addClass("childless");
                }
            }
            return tree;
        };
        renderList = function(nodes, css) {
            var i, len, list, node, nodeElement;
            if (css == null) {
                css = {};
            }
            list = $('<div class="ui tree-picker list"></div>').css(css);
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                if (config.hidden(node)) {
                    continue;
                }
                nodeElement = $("<div class=\"node\" data-id=\"" + node.id + "\" data-name=\"" + node.name + "\">\n  <div class=\"head " + node.selectable + "\">\n    <a class=\"name\">" + node.name + "</a>\n    <i class=\"checkmark icon\"></i>\n  </div>\n  <div class=\"content\"></div>\n</div>").appendTo(list);
                if (config.disabled(node)) {
                    nodeElement.addClass('disabled');
                }
            }
            return list;
        };
        initializeNodeList = function(tree) {
            return $('.node', tree).each(function() {
                var content, head, node;
                node = $(this);
                clickHead = $('>.head.selectable', node);
                head = $('>.head', node);
                content = $('>.content', node);
                $('>.name', clickHead).on('click', function(e) {
                    return nodeClicked(node);
                });
                if (nodeIsPicked(node)) {
                    node.addClass('picked');
                }
                if (!node.hasClass('childless')) {
					if (!head.hasClass('selectable')){
						$(head).on('click', function(e) {
							node.toggleClass('opened');
							return content.slideToggle();
						});
					}else{
						$('>.icon', head).on('click', function(e) {
							node.toggleClass('opened');
							return content.slideToggle();
						});
					}
                }
                return updatePickedIds();
            });
        };

        initializeNodeListForSelected = function(tree) {
            return $('.node', tree).each(function() {
                var content, head, node;
                node = $(this);
                clickHead = $('>.head', node);
                head = $('>.head', node);
                content = $('>.content', node);
                $('>.name', clickHead).on('click', function(e) {
                    return nodeClicked(node);
                });
                if (nodeIsPicked(node)) {
                    node.addClass('picked');
                }
                if (!node.hasClass('childless')) {
                    $('>.icon', head).on('click', function(e) {
                        node.toggleClass('opened');
                        return content.slideToggle();
                    });
                }
                return updatePickedIds();
            });
        };

        nodeClicked = function(node) {
            if (!node.hasClass('disabled')) {
                if (config.singlePick) {
                    $('.node.picked', modal).removeClass('picked');
                    picked = [];
                }
                node.toggleClass('picked');
                if (node.hasClass('picked')) {
                    return pickNode(node);
                } else {
                    return unpickNode(node);
                }
            }
        };
        pickNode = function(node) {
            var id;
            config.picked = null;
            id = node.attr('data-id');
            picked.push({
                id: id,
                name: node.attr('data-name')
            });
            updatePickedIds();
            return $(".node[data-id=" + id + "]", modal).addClass('picked');
        };
        unpickNode = function(node) {
            var id;
            config.picked = null;
            id = node.attr('data-id');
            picked = picked.filter(function(n) {
                return ("" + n.id) !== ("" + id);
            });
            updatePickedIds();
            return $(".node[data-id=" + id + "]", modal).removeClass('picked');
        };
        nodeIsPicked = function(node) {
            return picked.filter(function(n) {
                return ("" + n.id) === node.attr('data-id');
            }).length;
        };
        updatePickedIds = function() {
            widget.attr('data-picked-ids', picked.map(function(n) {
                return n.id;
            }));
            if (picked.length) {
                count.closest('.item').addClass('highlighted');
                return count.html("(" + picked.length + ")");
            } else {
                count.closest('.item').removeClass('highlighted');
                return count.html("");
            }
        };
        recursiveNodeSearch = function(nodes, comparator) {
            var i, len, node, results;
            results = [];
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                if (comparator(node)) {
                    results.push({
                        id: node.id,
                        name: node.name,
                        selectable: node.selectable
                    });
                }
                if (node[config.childrenKey] && node[config.childrenKey].length) {
                    results = results.concat(recursiveNodeSearch(node[config.childrenKey], comparator));
                }
            }
            return results;
        };
        return initialize();
    };

}).call(this);
//# sourceURL=semantic-ui-tree-picker.js
