var App = angular.module('overmind');

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Image Editor Directive -
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
App.directive('imageEditor', ['$rootScope', '$http', function($rootScope, $http) {

    return {
        restrict: 'A',
        templateUrl: '/static/src/partials/directives/image_editor.html',
        replace: true,
        scope: {
            imageSource: '=',
            mode: '@',
            saveMode: '@'
        },

        // The linking function will add behavior to the template
        link: function($scope, $element, $attrs) {

            // constants
            var X_OFFSET   = 0,
                Y_OFFSET   = 0,
                MIN_HEIGHT = 0,
                MIN_WIDTH  = 0,

                MOVE = 'move',
                CREATE = 'create',

                N_RESIZE = 'n-resize',
                E_RESIZE = 'e-resize',
                S_RESIZE = 's-resize',
                W_RESIZE = 'w-resize',

                NE_RESIZE = 'ne-resize',
                SE_RESIZE = 'se-resize',
                SW_RESIZE = 'sw-resize',
                NW_RESIZE = 'nw-resize';

            // properties
            var mouseMoveAction = null;

            // data
            var image = null;

            // scope data
            $scope.crop = {
                x: 0,
                y: 0,
                cropX: 0,
                cropY: 0,
                width: 0,
                height: 0,
                moveOriginX: 0,
                moveOriginY: 0
            };

            $scope.imageEditor = {
                progress: false
            };

            $scope.image = {
                width: 0,
                height: 0,
                uploading: false
            };

            // jquery elements
            var $imageEditor = $element.find('.image-editor'),
                $image       = $element.find('.image'),
                $crop        = $element.find('.crop-selection'),
                $cropOverlay = $element.find('.crop-overlay');


            initialize();
            createEventHandlers();


            /* createEventHandlers - handles angular events
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function createEventHandlers() {

                // watch: imageSource
                $scope.$watch('imageSource', function(imageSource, oldValue) {

                    if (imageSource) {
                        renderImage(imageSource);
                    }
                });

                // event: show-image-editor
                $scope.$on('show-image-editor', function(e) {
                    showImageEditor();
                });

                // event: hide-image-editor
                $scope.$on('hide-image-editor', function(e) {
                    hideImageEditor();
                });

                // event: image-pasted
                $scope.$on('image-pasted', function(e, pasteProperties) {
                    renderImage(pasteProperties.source);
                });

                // event: edit-image
                $scope.$on('edit-image', function(e, imageSource) {
                    renderImage(imageSource);
                });

                // event: image-saved
                $scope.$on('image-saved', function(e, data) {
                    disableEditor();
                });

                // imageEditor: mousewheel - scroll image position
                $imageEditor.mousewheel(function(event, delta, deltaX, deltaY) {

                });

                // imageEditor: mousedown - starting new crop selection
                $image.on('mousedown', function(e) {

                    $('body').addClass('disable-selection');

                    mouseMoveAction = CREATE;

                    clearSelectionDimensions();

                    var offset = $element.offset(),
                        mouseX = e.pageX - offset.left + $imageEditor.scrollLeft();
                        mouseY = e.pageY - offset.top + $imageEditor.scrollTop();

                    setSelectionOrigin(mouseX, mouseY);
                });

                // imageEditor: mouseup - stop selection
                $(document).on('mouseup', function(e) {

                    $('body').removeClass('disable-selection');

                    mouseMoveAction = null;

                    $crop.removeClass('drag');

                    if ($scope.crop.width === 0 || $scope.crop.height === 0) {
                        $cropOverlay.removeClass('active');
                        $crop.removeClass('active');
                    }
                });

                // crop: mousedown - moving crop location
                $crop.on('mousedown', function(e) {

                    $('body').addClass('disable-selection');

                    mouseMoveAction = MOVE;

                    $crop.addClass('drag');

                    var offset = $crop.offset(),
                        mouseX = e.pageX - offset.left;
                        mouseY = e.pageY - offset.top;

                    $scope.crop.moveOriginX = mouseX;
                    $scope.crop.moveOriginY = mouseY;

                    e.stopPropagation();
                });

                // event: mousemove
                $(document).on('mousemove', function(e) {

                    var offset = $element.offset(),
                        mouseX = e.pageX - offset.left + $imageEditor.scrollLeft();
                        mouseY = e.pageY - offset.top + $imageEditor.scrollTop();

                        // process mouse move
                        processMouseMove(mouseX, mouseY);
                });
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            /* initialize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function initialize() {


            }

            /* showImageEditor -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function showImageEditor() {
                enableEditor();
            }

            /* hideImageEditor -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function hideImageEditor() {
                disableEditor();
            }

            /* renderImage - set image background url from source url
            * source - source url created from data blob
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function renderImage(source) {

                enableEditor();
                $scope.imageEditor.progress = true;

                image = new Image();
                image.src = source;

                // on image load
                image.onload = function() {

                    $rootScope.safeApply(function() {

                        $scope.imageEditor.progress = false;
                        $scope.image.width = image.width;
                        $scope.image.height = image.height;
                    });

                    var backgroundAttribute = 'url(' + source + ')';

                    // set background-image, width and height
                    $image.css({'background-image': backgroundAttribute, 'width': image.width, 'height': image.height});
                };
            }

            /* enableEditor - activate image editor
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function enableEditor() {
                $element.removeClass('inactive');

                $rootScope.$broadcast('image-editor-enabled', {});
            }

            /* disableEditor - deactivate image editor
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function disableEditor() {
                $scope.imageEditor.progress = false;
                $element.addClass('inactive');

                $rootScope.$broadcast('image-editor-disabled', {});
            }


            /* processMouseMove -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function processMouseMove(mouseX, mouseY) {

                switch(mouseMoveAction) {

                    case MOVE:

                        var cropMouseX = mouseX - $scope.crop.moveOriginX - X_OFFSET;
                        var cropMouseY = mouseY - $scope.crop.moveOriginY - Y_OFFSET;

                        setSelectionOrigin(cropMouseX, cropMouseY);

                        break;

                    case CREATE:

                        if ($scope.crop.width > MIN_WIDTH && $scope.crop.height > MIN_HEIGHT) {
                            $cropOverlay.addClass('active');
                            $crop.addClass('active');
                        } else {
                            $cropOverlay.removeClass('active');
                            $crop.removeClass('active');
                        }

                        setSelectionSize($scope.crop.x - X_OFFSET, $scope.crop.y - Y_OFFSET, mouseX, mouseY);

                        break;

                    case N_RESIZE:

                        break;

                    case E_RESIZE:

                        setSelectionSize($scope.crop.x - X_OFFSET, $scope.crop.y - Y_OFFSET, mouseX, $scope.crop.offsetY);

                        break;

                    case S_RESIZE:


                        break;

                    case W_RESIZE:

                        break;
                }
            }

            /* clearSelectionDimensions - remove crop selection width and height
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function clearSelectionDimensions() {

                $scope.crop.width = 0;
                $scope.crop.height = 0;

                $crop.css({'width': 0, 'height': 0});
            }

            /* northResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function northResize(e) {
                mouseMoveAction = N_RESIZE;
                e.stopPropagation();
            }
            /* eastResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function eastResize(e) {
                $('body').addClass('disable-selection');
                mouseMoveAction = E_RESIZE;
                e.stopPropagation();
            }
            /* southResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function southResize(e) {
                mouseMoveAction = S_RESIZE;
                e.stopPropagation();
            }
            /* westResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function westResize(e) {
                mouseMoveAction = W_RESIZE;
                e.stopPropagation();
            }


            /* northEastResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function northEastResize(e) {
                mouseMoveAction = NE_RESIZE;
                e.stopPropagation();
            }
            /* southEastResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function southEastResize(e) {
                mouseMoveAction = SE_RESIZE;
                e.stopPropagation();
            }
            /* southWestResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function southWestResize(e) {
                mouseMoveAction = SW_RESIZE;
                e.stopPropagation();
            }
            /* northWestResize -
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function northWestResize(e) {
                mouseMoveAction = NW_RESIZE;
                e.stopPropagation();
            }

            /* setSelectionSize - set width and height of crop selection
            * x, y - origin
            * offsetX, offSetY - current mouse position
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function setSelectionSize(x, y, offsetX, offsetY) {

                // initial style
                var style = {
                    x: x,
                    y: y,
                    width: offsetX - x,
                    height: offsetY - y
                };

                // invert if mouse position above or left of origin point
                if (style.width < 0) {
                    style.width *= -1;
                    style.x -= style.width;
                }
                if (style.height < 0) {
                    style.height *= -1;
                    style.y -= style.height;
                }

                // limit
                if (style.x < 0) {
                    style.width += style.x;
                    style.x = 0;
                }
                if ((style.x + style.width) > $scope.image.width) {
                    style.width = $scope.image.width - style.x;
                }
                if (style.y < 0) {
                    style.height += style.y;
                    style.y = 0;
                }
                if ((style.y + style.height) > $scope.image.height) {
                    style.height = $scope.image.height - style.y;
                }

                // set style
                $crop.css({'left': style.x, 'top': style.y});
                $crop.css({'width': style.width, 'height': style.height});
                $crop.css({'background-position': -style.x + 'px ' + -style.y + 'px'});

                // save style
                $scope.crop.width = style.width;
                $scope.crop.height = style.height;

                // origin point
                $scope.crop.cropX = style.x;
                $scope.crop.cropY = style.y;

                // mouse offset
                $scope.crop.offsetX = offsetX;
                $scope.crop.offsetY = offsetY;
            }

            /* setSelectionOrigin - set starting position of crop selection
            * x, y - mouse offset
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function setSelectionOrigin(x, y) {

                // limit
                if (x < 0) {
                    x = 0;
                }
                if ((x + $scope.crop.width) > $scope.image.width) {
                    x = $scope.image.width - $scope.crop.width;
                }
                if (y < 0) {
                    y = 0;
                }
                if ((y + $scope.crop.height) > $scope.image.height) {
                    y = $scope.image.height - $scope.crop.height;
                }

                $scope.crop.x = x;
                $scope.crop.y = y;

                $scope.crop.cropX = x;
                $scope.crop.cropY = y;

                $crop
                    .css({'left': x, 'top': y})
                    .css({'background-position': -x + 'px ' + -y + 'px'});
            }

            /* saveImage - crop and save image
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function saveImage() {

                $scope.imageEditor.progress = true;

                var canvas = null,
                    context = null;

                canvas = document.createElement("canvas");

                // get cropped image
                canvas.width = $scope.crop.width;
                canvas.height = $scope.crop.height;
                context = canvas.getContext("2d");
                context.drawImage(image, -$scope.crop.cropX, -$scope.crop.cropY);

                convertImage(canvas, $scope.saveMode);
            }

            /* convertImage - convert image from canvas to base64 or blob
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            function convertImage(canvas, saveMode) {

                // base64
                if (saveMode === 'base64' && canvas.toDataURL) {

                    // compress image
                    var dataURL = canvas.toDataURL('image/jpeg', 0.90);
                    // strip header - uneeded for proper decode to image from base64
                    file = dataURL.replace('data:image/jpeg;base64,', '');

                    // emit save-event
                    $scope.$emit('save-image', file);

                // blob
                } else if (canvas.toBlob) {

                    // convert canvas to blob
                    blob = canvas.toBlob(function(file) {

                        // emit save-event
                        $scope.$emit('save-image', file);
                    });

                } else {
                    // emit save-event
                    $scope.$emit('save-image', false);
                }
            }

            /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            * Scope Methods
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            $scope.saveImage = saveImage;
            $scope.hideImageEditor = hideImageEditor;
            $scope.northResize = northResize;
            $scope.eastResize = eastResize;
            $scope.southResize = southResize;
            $scope.westResize = westResize;
            $scope.northEastResize = northEastResize;
            $scope.southEastResize = southEastResize;
            $scope.southWestResize = southWestResize;
            $scope.northWestResize = northWestResize;
        }
    };
}]);
