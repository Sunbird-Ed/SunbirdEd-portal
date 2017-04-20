app.directive('ngIlMultiselect', function ($compile, $timeout) {
    var nextId = 0;
    return {
    	restrict: 'A',
        require: 'ngModel',
    	scope: {},
      	templateUrl: '',
      	link: function(scope, iElement, attrs, ngModel) {
            var uniqueId ="ml-sl-";
            var onOpen = false;
            if (attrs.id == null) {
                uniqueId += nextId++;
                iElement.attr('id', uniqueId);
                attrs.id = uniqueId;
            } else {
                uniqueId = attrs.id;
            }

            var placeholder = "";
            if(attrs.ngIlMultiselect) {
                var config = JSON.parse(attrs.ngIlMultiselect);
                if(config && config.placeholder) placeholder = config.placeholder;
                if(config && config.selectedDisable) onOpen = true;
            }


            scope.$watch(function() {
                initializeSelect2();
            });

            function initializeSelect2() {
                setTimeout(function() {
                    var select2Object = $("#"+uniqueId).select2({
                        formatResult: function(state) {
                                return state.text;
                            },
                        placeholder: placeholder,
                        formatSelection: function(state) {
                            return state.text.replace(/&emsp;/g, '');
                        },
                        allowClear: true,
                        escapeMarkup: function(m) { return m; }
                    });
                    if(onOpen) {
                        select2Object.on("select2-open", function() {
                          $(".select2-selected").removeClass("select2-selected").addClass("select2-disabled");
                        });    
                    }
                }, 100);
            }

            initializeSelect2();

      	}
    };
});