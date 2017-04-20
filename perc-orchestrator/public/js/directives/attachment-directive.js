app.directive('fileModel', ['$parse', '$http', '$rootScope',function ($parse, $http, $rootScope) {
    return {
        restrict: 'A',
        templateUrl: '/templates/directives/interactions/uploadFile.html',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            scope.allowedFileTypes = {"mime":"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpg,image/jpeg"};
            element.bind('change', function(changeEvent){
                scope.targetFile = changeEvent.target.files[0];
            });

            scope.uploadAttachment = function(){
                var file = this.targetFile;
                console.log('file is -->' + JSON.stringify(file));

                if(!file) return false;
                if(this.allowedFileTypes.mime.indexOf(file.type) == -1){
                    alert('Invalid file format');
                    return false;
                }

                var uploadUrl = "/private/v1/interaction/upload/file/";

                this.uploadFile(file, uploadUrl);
            }

            scope.uploadImage = function(){
                var file = this.targetFile;
                console.log('file is ' + JSON.stringify(file));

                if(!file) return false;

                  if(file.type.indexOf('image/') == -1){ 
                    scope.showAlertMessage($('.popupMess'),'Invalid file format','showPopup');
                    return false;
                }

                var uploadUrl = "/private/v1/interaction/upload/file/";

                this.uploadFile(file, uploadUrl);
            }

            scope.uploadFile = function(file, uploadUrl){

                 if(file.size > 2000000){ 
                    scope.showAlertMessage($('.popupMess'),'File size should not more than 2MB','showPopup');
                    return false;
                 }
                var fd = new FormData();
                var customCourseId = $rootScope.courseLobId.replace(':','_');
                fd.append('fileObj', file);
                fd.append('courseLobId', customCourseId);                
                $http.post(uploadUrl, fd, {            
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(resp){
                    if(resp.errStatus == 0){
                        scope.attachments.push(resp);
                        scope.filePreview = true;
                        scope.showAlertMessage($('.popupMess'),'Files uploaded successfully','hidePopup');                        
                    } 
                    else{
                        scope.showAlertMessage($('.popupMess'),'Something Went wrong! please try again','hidePopup');                        
                    }                  
                                
                })
                .error(function(){
                    scope.showAlertMessage($('.popupMess'),'Something Went wrong! please try again','hidePopup');
                });
            };

            //Delete file from server
            scope.deleteFile = function(elemObj){

                var deleteConfirmation = confirm('Do you want to delete?');

                if(deleteConfirmation == false) return false;

                var $elemObj = $(elemObj.currentTarget);
                
                var deleteFileObj = {'deleteFileName':$elemObj.attr('customAttr')};

                var deleteUploadedFileUrl = "/private/v1/interaction/deleteuploadedFile/file/";
                $http.post(deleteUploadedFileUrl, deleteFileObj).
                success(function(data, status, headers, config) {
                    $elemObj.next().remove();
                    $elemObj.remove();
                }).
                error(function(data, status, headers, config) {
                    alert('err');
                });
            }
        }
    };
}]);