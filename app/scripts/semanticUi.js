       function initSemanticUi() {
           $('.ui.accordion')
               .accordion();

           $('.dropdown').dropdown({
               useLabels: false,
               forceSelection: false,
               label: {
                   duration: 0,
               },
               debug: true,
               performance: true,
           });

       }
       window.onload = initSemanticUi;