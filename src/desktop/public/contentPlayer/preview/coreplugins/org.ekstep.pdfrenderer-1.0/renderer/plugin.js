
org.ekstep.contentrenderer.baseLauncher.extend({
    _manifest: undefined,
    CURRENT_PAGE: undefined,
    CANVAS: undefined,
    TOTAL_PAGES: undefined,
    PAGE_RENDERING_IN_PROGRESS: undefined,
    PDF_DOC: undefined,
    CANVAS_CTX: undefined,
    USE_ONLY_CSS_ZOOM: true,
    TEXT_LAYER_MODE: 0, // DISABLE,
    DEFAULT_SCALE_VALUE: 'auto',
    DEFAULT_SCALE_DELTA : 1.1,
    MIN_SCALE: 0.25,
    MAX_SCALE: 10.0,
    messages: {
        noInternetConnection: "Internet not available. Please connect and try again."
    },
    optionalData: {},
    context: undefined,
    stageId: [],
    heartBeatData: {},
    isPageRenderingInProgress: undefined,
    enableHeartBeatEvent: true,
    headerTimer: undefined,
    previousScale: undefined,
    pinchType :undefined,
    _constants: {
        mimeType: ["application/pdf"],
        events: {
            launchEvent: "renderer:launch:pdf"
        }
    },
    pdfViewer: null,
    pdfDocument:null,

    initLauncher: function(manifestData) {
        console.info('PDF Renderer init', manifestData)
        EkstepRendererAPI.addEventListener(this._constants.events.launchEvent, this.start, this);
        this._manifest = manifestData;
        EkstepRendererAPI.addEventListener('nextClick', this.nextNavigation, this);
        EkstepRendererAPI.addEventListener('previousClick', this.previousNavigation, this);
    },

    renderCurrentScaledPage: function () {
        var container = document.getElementById(this.manifest.id);
        var pdfViewer = new pdfjsViewer.PDFViewer({
            container: container,
            l10n: context.l10n,
            useOnlyCssZoom: context.USE_ONLY_CSS_ZOOM,
            textLayerMode: context.TEXT_LAYER_MODE,
        });

        this.pdfViewer = pdfViewer;
       
        document.addEventListener('pagesinit', function () {
            // We can use pdfViewer now, e.g. let's change default scale.
            context.pdfViewer.currentScaleValue = context.DEFAULT_SCALE_VALUE;
            $("#pdf-loader").css("display","none");
            $("#pdf-contents").show();
            // $("#pdf-buttons").show();
             $("#pdf-find-text").val(context.pdfViewer.currentPageNumber);
        });
    
    },

    enableOverly: function () {
        EkstepRendererAPI.dispatchEvent("renderer:overlay:show");
        EkstepRendererAPI.dispatchEvent('renderer:stagereload:hide');
        $('#pdf-buttons').css({
            display: 'none'
        });
        setTimeout(function() {
            jQuery('previous-navigation').show();
            jQuery('next-navigation').show();
            jQuery('custom-previous-navigation').hide();
            jQuery('custom-next-navigation').hide();
        }, 100);
    },
    start: function() {
        this._super();
        this.l10n = pdfjsViewer.NullL10n;
        context = this;
        var data = _.clone(content);
        this.initContentProgress();
        var path = undefined;
        var globalConfigObj = EkstepRendererAPI.getGlobalConfig();
        if (window.cordova || !isbrowserpreview) {
            var regex = new RegExp("^(http|https)://", "i");
            if(!regex.test(globalConfigObj.basepath)){
                var prefix_url = globalConfigObj.basepath || '';
                path = prefix_url + "/" + data.artifactUrl + "?" + new Date().getSeconds();
                context.optionalData = { "artifactUrl": path };
            }else
                path = data.streamingUrl;
                context.optionalData = { "streamingUrl": path };
        } else {
            path = data.artifactUrl + "?" + new Date().getSeconds();
            context.optionalData = { "artifactUrl": path };
        }
        
        var div = document.createElement('div');
        div.src = path;
        context.addToGameArea(div);
        context.renderPDF(path, document.getElementById(this.manifest.id), this.manifest);
        

        setTimeout(function() {
            context.enableOverly();
        }, 100);
        context.onScrollEvents();

    },
    onScrollEvents: function() {
        var timeout = null;
        var context = this;
        $('#' + this.manifest.id).bind('scroll', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
               context.logInteractEvent('SCROLL', 'page', '', {
                    stageId: context.CURRENT_PAGE.toString(),
                    subtype: ''
                });
            }, 50);
        });
    },
    replay: function() {
        if (this.sleepMode) return;
        this._super();
        this.enableOverly();
    },
    renderPDF: function(path, canvasContainer) {


        EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
        var pdfMainContainer = document.createElement("div");
        pdfMainContainer.id = "pdf-main-container";

        var pdfBodyContainer = document.createElement("div");
        pdfBodyContainer.id = "pdf-body-container";

        var pdfLoader = document.createElement("div");
        pdfLoader.id = "pdf-loader";
        pdfLoader.textContent = "Loading document ...";

        var pdfNoPage = document.createElement("div");
        pdfNoPage.id = "pdf-no-page";
        pdfNoPage.textContent = "No Page Found";

        var pdfContents = document.createElement("div");
        pdfContents.id = "pdf-contents";
        pdfContents.className = "sb-pdf-container";

        var pdfMetaData = document.createElement("div");
        pdfMetaData.id = "pdf-meta";
        pdfMetaData.className = "sb-pdf-header";

        var pdfMetaDataFake = document.createElement("div");
        pdfMetaDataFake.id = "pdf-meta-fake";
        pdfMetaDataFake.className = "sb-pdf-headerfix";

        var pdfButtons = document.createElement("div");
        pdfButtons.id = "pdf-buttons";

        // var pdfZoomIn = document.createElement("img");
        // pdfZoomIn.src = "assets/icons/zoom-in1.png";
        // pdfZoomIn.id = "pdf-zoomIn";
        

        // var pdfZoomOut = document.createElement("img");
        // pdfZoomOut.src = "assets/icons/zoom-out1.png";
        // pdfZoomOut.id = "pdf-zoomOut";
        

        var pdfDownloadContainer = document.createElement("div");
        pdfDownloadContainer.id = "pdf-download-container";
        pdfDownloadContainer.className = "download-pdf-image";

        /**pdf error popup to download pdf */
        var pdfErrorPopup = document.createElement("div");
        var pdfErrorMessage = document.createElement("p");
        pdfErrorPopup.id = "pdf-error-popup";
        pdfErrorMessage.textContent = "Your internet connection is unstable. Please download the PDF to play the content.";
        pdfErrorPopup.appendChild(pdfErrorMessage);

        var pdfTitleContainer = document.createElement("div");
        pdfTitleContainer.textContent = content.name;
        pdfTitleContainer.className = "pdf-name";

        var pdfSearchContainer = document.createElement("div");
        pdfSearchContainer.id = "pdf-search-container";


        if (!window.cordova){
            pdfMetaData.appendChild(pdfDownloadContainer);
            this.addDownloadButton(path, pdfDownloadContainer, true);
        }

        var pageCountContainer = document.createElement("div");
        pageCountContainer.id = "page-count-container";
        pageCountContainer.className = "pdf-searchbar";

        var pdfPageSearch = document.createElement("div");
        pdfPageSearch.className = "page-search";

        var pdfPageSearchBox = document.createElement("div");
        pdfPageSearchBox.className = "search-box";

        var pageName = document.createElement("span");
        pageName.textContent = "Page ";


        var goButton = document.createElement("div");
        goButton.className = "search-page-pdf-arrow-container";
        goButton.style.display = "none";

        var goButtonImage = document.createElement("img");
        goButtonImage.src = "assets/icons/arrow-pointing-to-right.png";
        goButtonImage.id = "pdf-find";
        goButtonImage.className = "search-page-pdf-arrow";

        var ofText = document.createElement("span");
        ofText.className = "bold-page";
        ofText.textContent = " / ";

        var pdfTotalPages = document.createElement("span");
        pdfTotalPages.id = "pdf-total-pages";
        pdfTotalPages.className = "bold-page"

        var findTextField = document.createElement("input");
        findTextField.type = "number";
        findTextField.id = "pdf-find-text";
        findTextField.className = "search-input";
        findTextField.min = 1;
        // findTextField.max = parseInt(document.getElementById('pdf-total-pages').innerHTML);

        var searchPdfTotalPages = document.createElement('div');
        searchPdfTotalPages.className = "search-page-number";

        pdfPageSearchBox.appendChild(findTextField);
        goButton.appendChild(goButtonImage);
        searchPdfTotalPages.appendChild(ofText);
        searchPdfTotalPages.appendChild(pdfTotalPages);
        // pdfPageSearch.appendChild(pdfPageSearchBox);
        pageCountContainer.appendChild(pdfPageSearchBox);
        pageCountContainer.appendChild(goButton);
        pageCountContainer.appendChild(searchPdfTotalPages);

        
        // pdfButtons.appendChild(pdfZoomIn);
        // pdfButtons.appendChild(pdfZoomOut);
        
        pdfMetaData.appendChild(pdfSearchContainer);
        pdfMetaData.appendChild(pdfTitleContainer);
        //pdfMetaData.appendChild(pdfButtons);
        pdfMetaData.appendChild(pageCountContainer);

        var sbPdfBody = document.createElement('div');
        sbPdfBody.id = "pdf-canvas-container";
        sbPdfBody.className = "sb-pdf-body";

        var pdfCanvas = document.createElement("canvas");
        pdfCanvas.id = "pdf-canvas";
        pdfCanvas.width = "700";
        pdfCanvas.style = "maxHeight:100px";

        sbPdfBody.appendChild(pdfCanvas);

        pdfContents.appendChild(pdfMetaData);
        pdfContents.appendChild(pdfMetaDataFake);
        pdfContents.appendChild(sbPdfBody);
        pdfContents.appendChild(pdfNoPage);

    
        pdfBodyContainer.appendChild(pdfLoader);
        pdfBodyContainer.appendChild(pdfContents);
        //pdfBodyContainer.appendChild(sbPdfBody);
        pdfBodyContainer.appendChild(pdfErrorPopup);

        canvasContainer.appendChild(pdfMainContainer);

        canvasContainer.appendChild(pdfBodyContainer);

        document.getElementById(this.manifest.id).style.overflow = "auto";

        var hammerManager = new Hammer(pdfMainContainer, {
            touchAction: "pan-x pan-y"
        });
        hammerManager.get('pinch').set({ enable: true });

        hammerManager.on("pinchin", function (ev) {
            pinchType = 'pinchIn';
        });
        hammerManager.on("pinchout", function (ev) {
            pinchType = 'pinchOut';
        });
        hammerManager.on("pinchend", function (ev) {
            if (pinchType === 'pinchIn') {
               // previousScale = previousScale - 0.25;
                //context.renderCurrentScaledPage();
                context.zoomOut();
            } else if (pinchType === 'pinchOut') {
                //previousScale = previousScale + 0.25;
                //context.renderCurrentScaledPage();
                 context.zoomIn();
            }
            pinchType = undefined;
        });

        context.PDF_DOC = 0;
        context.CURRENT_PAGE = 0;
        context.TOTAL_PAGES = 0;
        context.PAGE_RENDERING_IN_PROGRESS = 0;
        context.CANVAS = $('#pdf-canvas').get(0);
        context.CANVAS_CTX = context.CANVAS.getContext('2d');

        
          context.renderCurrentScaledPage();
        

        $(".search-page-pdf-arrow-container").on('click', function() {
            var searchText = document.getElementById("pdf-find-text");
            console.log("SEARCH TEXT", searchText.value);
            context.value = searchText.value;
            context.pdfViewer.currentPageNumber = (searchText.value | 0);
            context.logInteractEvent("TOUCH", "navigate", "TOUCH", {
                stageId: context.pdfViewer.currentPageNumber.toString(),
                subtype: ''
            });
            context.logImpressionEvent(context.pdfViewer.currentPageNumber.toString(), searchText.value);
        });

        $('#pdf-find-text').on('focus blur', function(e) {
            if( e.type == 'focus' ){
                $(".search-page-pdf-arrow-container").css( "display", "inline" );
                $(".search-page-number").css( "display", "none" );
                $(".search-input").css({ "border-top-right-radius": "0px", "border-bottom-right-radius": "0px"});
              }
              else{
                $(".search-page-pdf-arrow-container").css("display", "none");
                $(".search-page-number").css( "display", "inline" );
                $(".search-input").css({ "border-top-right-radius": "4px", "border-bottom-right-radius": "4px"});
              }
        });
        $('.search-page-pdf-arrow-container').on('mousedown', function(event) {
            event.preventDefault();
        });


        // document.getElementById('pdf-zoomIn').addEventListener('click', function() {
        //     context.zoomIn();
        //   });
      
        //   document.getElementById('pdf-zoomOut').addEventListener('click', function() {
        //     context.zoomOut();
        //   });

        this.heartBeatData.stageId = context.CURRENT_PAGE.toString();
        context.showPDF(path, context.manifest);
        var obj = {"tempName": "navigationTop"};
        EkstepRendererAPI.dispatchEvent("renderer:navigation:load", obj);

        // listening to scroll event for pdf
       
        document.getElementById(this.manifest.id).onscroll = function () {
                var pageNumber = document.getElementById('pdf-find-text').value;
                if(!context.stageId.includes(context.pdfViewer.currentPageNumber.toString())){
                    context.stageId.push(context.pdfViewer.currentPageNumber.toString());
                }
               $("#pdf-find-text").val(context.pdfViewer.currentPageNumber);
                  if(pageNumber>context.pdfViewer.currentPageNumber){
                    $("#pLoader").css("display","block");
                    context.logInteractEvent("TOUCH", "previous", "TOUCH", {
                        stageId: context.pdfViewer.currentPageNumber.toString()
                    });
                  }else if(pageNumber<context.pdfViewer.currentPageNumber){
                    $("#pLoader").css("display","block");
                    context.logInteractEvent("TOUCH", "next", "TOUCH", {
                        stageId: context.pdfViewer.currentPageNumber.toString()
                    });
                  }

                  if($(this)[0].offsetHeight + $(this).scrollTop() >= $(this)[0].scrollHeight) {
                    EkstepRendererAPI.dispatchEvent('renderer:content:end');
                }
            
        }
    },
    addDownloadButton: function(path, pdfSearchContainer, showIcon, callback){
        if(!path.length) return false;
        var instance = this;
        if (showIcon){
            var downloadBtn = document.createElement("img");
            downloadBtn.id = "download-btn";
            downloadBtn.src = "assets/icons/down-arrow.png";
            downloadBtn.className = "pdf-download-btn";
        }else {
            var downloadBtn = document.createElement("BUTTON");
            downloadBtn.textContent = "Download PDF";
            downloadBtn.className = "sb-btn sb-btn-normal sb-btn-primary";
        }
        downloadBtn.onclick = function(){
            callback && callback();
            if (!window.cordova) window.open(path, '_blank');
            context.logInteractEvent("TOUCH", "Download", "TOUCH", {
                stageId: context.CURRENT_PAGE.toString(),
                subtype: ''
            });
        };
        pdfSearchContainer.appendChild(downloadBtn);
    },

    zoomIn: function pdfViewZoomIn(ticks) {
        var newScale = context.pdfViewer.currentScale;
        do {
          newScale = (newScale * context.DEFAULT_SCALE_DELTA).toFixed(2);
          newScale = Math.ceil(newScale * 10) / 10;
          newScale = Math.min(context.MAX_SCALE, newScale);
        } while (--ticks && newScale < context.MAX_SCALE);
        context.pdfViewer.currentScaleValue = newScale;
      },
    
      zoomOut: function pdfViewZoomOut(ticks) {
        var newScale = context.pdfViewer.currentScale;
        do {
          newScale = (newScale / context.DEFAULT_SCALE_DELTA).toFixed(2);
          newScale = Math.floor(newScale * 10) / 10;
          newScale = Math.max(context.MIN_SCALE, newScale);
        } while (--ticks && newScale > context.MIN_SCALE);
        context.pdfViewer.currentScaleValue = newScale;
      },

    nextNavigation: function() {
        if (this.sleepMode) return;
        // context.logInteractEvent("TOUCH", "next", null, {
        //     stageId: context.CURRENT_PAGE.toString()
        // });
        EkstepRendererAPI.getTelemetryService().navigate(context.pdfViewer.currentPageNumber.toString(), (context.pdfViewer.currentPageNumber + 1).toString());
        if (context.pdfViewer.currentPageNumber != context.pdfDocument.numPages) {
           context.pdfViewer.currentPageNumber++
        } else if (context.pdfViewer.currentPageNumber === context.pdfDocument.numPages) {
            EkstepRendererAPI.dispatchEvent('renderer:content:end');
        }
    },
    previousNavigation: function() {
        if (this.sleepMode) return;
        // context.logInteractEvent("TOUCH", "previous", null, {
        //     stageId: context.CURRENT_PAGE.toString()
        // });
        EkstepRendererAPI.getTelemetryService().navigate(context.pdfViewer.currentPageNumber.toString(), (context.pdfViewer.currentPageNumber - 1).toString());
        if(context.pdfViewer.currentPageNumber != 1){
            context.pdfViewer.currentPageNumber--
        }
    },
    showPDF: function(pdf_url) {
        var instance = this;
        if (!navigator.onLine) {
            instance.throwError({ message: instance.messages.noInternetConnection });
        }
        try {
            $("#pdf-error-popup").css("display","none");
            $("#pdf-loader").css("display","block"); // use rendere loader
            console.log("MANIFEST DATA", this.manifest)
            console.log("pdfjsLib lib", pdfjsLib)
            pdfjsLib.disableWorker = true;

            // use api to resolve the plugin resource
            // The workerSrc property shall be specified.
            pdfjsLib.GlobalWorkerOptions.workerSrc = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this.manifest.id, this.manifest.ver, "renderer/libs/pdf.worker.js");
            var loadPDf = pdfjsLib.getDocument(pdf_url)
            loadPDf.promise.then(function(pdfDocument) {
                context.PDF_DOC = pdfDocument;
                context.TOTAL_PAGES = pdfDocument.numPages;
                context.pdfDocument = pdfDocument;
                context.pdfViewer.setDocument(pdfDocument);
                $("#pdf-total-pages").text(pdfDocument.numPages);
                $('#pdf-find-text').prop('max',context.TOTAL_PAGES);

            }).catch(function(error) {
                // If error re-show the upload button
                $("#pdf-loader").css("display","none");
                $("#upload-button").show();
                if (!error.message) {
                    error.message = (navigator.onLine) ? "Missing PDF" : "No internet - Missing PDF";
                }else{
                    error.message = (navigator.onLine) ? error.message : "No internet - " + error.message;
                }
                error.logFullError = true;
                error.message = error.message + "options: " + JSON.stringify(context.optionalData);
                $("#pdf-error-popup").css("display","flex");
                var pdfErrorPopup = $("#pdf-error-popup")[0];
                instance.addDownloadButton(pdf_url, pdfErrorPopup, false, function(){
                    error.pdfUrl = pdf_url;
                    instance.postError(error);
                });
                EkstepRendererAPI.logErrorEvent(error, {
                    'type': 'content',
                    'action': 'play',
                    'severity': 'error'
                });
            });
        }
        catch (e){
            console.log(e);
            TelemetryService.error({
                err: e.code,
                errtype: "CONTENT",
                stacktrace: data.stacktrace || "",
                pageid: "PDF-renderer",
                plugin: {
                    "id": instance.manifest.id,
                    "ver": instance.manifest.ver,
                    "category": "core"
                  }
            });
        }
    },
   
    initContentProgress: function() {
        var instance = this;
        EkstepRendererAPI.addEventListener("sceneEnter", function(event) {
            if (this.sleepMode) return;
            instance.stageId.push(event.target.CURRENT_PAGE);
        });
    },
    contentProgress: function() {
        var totalStages = this.TOTAL_PAGES;
        var currentStageIndex = _.size(_.uniq(this.stageId)) || 1;
        return this.progres(currentStageIndex, totalStages);
    },
    contentPlaySummary: function () {
        var playSummary =  [
            {
              "totallength":  parseInt(this.TOTAL_PAGES)
            },
            {
              "visitedlength": parseInt(_.max(this.stageId))
            },
            {
              "visitedcontentend": (this.TOTAL_PAGES == Math.max.apply(Math, this.stageId)) ? true : false
            },
            {
              "totalseekedlength": parseInt(this.TOTAL_PAGES) - _.size(_.uniq(this.stageId))
            }
        ]
        return playSummary;
    },

    // use this methos to send additional content statistics
    additionalContentSummary: function () {
        return
    },

    logInteractEvent: function(type, id, extype, eks, eid){
        window.PLAYER_STAGE_START_TIME = Date.now()/1000;
        EkstepRendererAPI.getTelemetryService().interact(type, id, extype, eks,eid);
    },
    logImpressionEvent: function(stageId, stageTo){
        EkstepRendererAPI.getTelemetryService().navigate(stageId, stageTo, {
            "duration": (Date.now()/1000) - window.PLAYER_STAGE_START_TIME
        });
    },
    postError: function(error){
        var origin = ""
        if (!window.location.origin) {
            origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")
        } else {
            origin = window.location.origin
        }

        if (window.cordova){
            window.postMessage({"player.pdf-renderer.error": error}, origin)
        }else{
            parent.postMessage({"player.pdf-renderer.error": error}, origin)
        }
    }
});

//# sourceURL=PDFRenderer.js
