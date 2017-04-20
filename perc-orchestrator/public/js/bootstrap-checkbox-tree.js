/*
 * CheckboxTree
 * https://github.com/mikkolehtinen/bootstrap-checkbox-tree
 *
 *
 * Based on https://github.com/antihero/Collapsible-Checkbox-Tree-jQuery-Plugin
 *
 * Copyright (c) 2012 Mikko Lehtinen
 * Licensed under the MIT license.
 */

!function ($) {
  "use strict";

  var CheckboxTree = function (element, options) {
    this.$element = $(element);
    this.options  = $.extend(true, $.fn.checkboxTree.defaults, options);
    this.initMarkup();
    this.$element.find("input[type='checkbox']")
      .on('click', $.proxy(this.checkboxTicked, this));
    this.$element.find("li:has(> ul) span")
      .on('click', $.proxy(this.expandOrCollapseBranch, this));

    switch(this.options.initialState) {
      case 'expand':
        this.expandAll();
        break;
      case 'collapse':
        this.collapseAll();
        break;
      default:
        this.defaultExpand();
    }

    return this;
  };

  CheckboxTree.prototype = {

    initMarkup: function() {
      // Add tree collapse/expand links
      this.$element.find("li").prepend('<span>&nbsp;</span>');
      // Check children if necessary
      if (this.options.checkChildren) {
        this.$element.find("input:checked").parent("li").find("input[type='checkbox']").attr('checked', true);
      }
    },

    checkboxTicked: function(e) {
      var $cb = $(e.currentTarget);
      var parent = $cb.parent("li");

      if ($cb.is(":checked")) {
        // Show immediate children  of checked
        parent.find("> ul").removeClass('hide');
        // Update the tree
        this.expandEl(parent.find("> span.collapsed"));

        // Check children if necessary
        if (this.options.checkChildren) {
          parent.find("input[type='checkbox']").attr('checked', true);
          // Show all children of checked
          parent.find("ul").removeClass('hide');

          // Expand the tree
          this.expandEl(parent.find("span.collapsed"));
        }

      // If unchecking...
      } else {
        // Uncheck children if necessary
        if (this.options.uncheckChildren) {
          parent.find("input[type='checkbox']").attr('checked', false);
          // Hide all children
          if(this.options.hideChildrenWhenUnchecking) {
            parent.find("ul").addClass('hide');
            // Collapse the tree
            this.collapseEl(parent.find("span.expanded"));
          }
        }
      }
      this.notifyListeners();
    },

    notifyListeners: function() {
      // trigger a custom event
      this.$element.trigger({
        type: "checkboxTicked"
      });
    },

    expandOrCollapseBranch: function(e) {
      var $el = $(e.currentTarget);
      // If was previously collapsed...
      if ($el.is(".collapsed")) {
        if(this.options.singleBranchOpen) {
          this.collapseAll();
        }

        // ... then expand
        $("> ul", $el.parent("li")).removeClass('hide');
        this.expandEl($el);

      // If was previously expanded...
      } else if ($el.is(".expanded")) {

        // ... then collapse
        $("> ul", $el.parent("li")).addClass('hide');
        this.collapseEl($el);
      }
    },

    expandAll: function() {
      // Show all children
      this.$element.find("ul").removeClass('hide');
      // and update the html
      this.expandEl(this.$element.find("li:has(> ul) > span"));
    },

    collapseAll: function() {
      // Hide all children
     // this.$element.find("ul").addClass('hide');
      // and update the html
      this.collapseEl(this.$element.find("li:has(> ul) > span"));
    },

    defaultExpand: function() {
      // Hide all except top level
     // this.$element.find("ul:not(.root)").addClass('hide');

      if(this.options.openBranches) {
        var openBranches = this.$element.find(this.options.openBranches.join(','));
        openBranches.removeClass('hide');
      } else {
        // Show checked and immediate children of checked
        this.$element.find("li:has(input:checked) > ul").removeClass('hide');
      }

      // and update the html
      this.expandEl(this.$element.find("li:has(> ul:not(.hide)) > span"));
      this.collapseEl(this.$element.find("li:has(> ul.hide) > span"));
    },

    checkAll: function() {
      this.$element.find("input[type='checkbox']").attr('checked', true);
      this.notifyListeners();
    },

    uncheckAll: function() {
      this.$element.find("input[type='checkbox']").attr('checked', false);
      this.notifyListeners();
    },

    expandEl: function($el) {
      $el.removeClass("collapsed").addClass("expanded");
    },

    collapseEl: function($el) {
      $el.removeClass("expanded").addClass("collapsed");
    }
  };

  $.fn.checkboxTree = function (options) {
    return new CheckboxTree(this, options);
  };

  $.fn.checkboxTree.defaults = {
    checkChildren : true, // When checking a box, all children are checked
    uncheckChildren : true, // When unchecking a box, all children are unchecked
    initialState : 'default', // Options - 'expand' (fully expanded), 'collapse' (fully collapsed) or default
    singleBranchOpen: false, // when toggling branches open allow only one branch to be open at once (supports only single level of hierarchy)
    openBranches: null // Array to specify selectors of default expanded branches
  };

}(window.jQuery);
