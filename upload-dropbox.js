var app = (function (app) {
    'use strict';

    var UI = app.ui,
        core = app.core,
        iAmTheClientThatSendFile = false;

    app.upload = {

        sendToDropbox: function () {
            //var file = e.target.files[0];
            var file = document.querySelector('#txtFile').files[0];

            var send = function() {
                var client = new Dropbox.Client({key: app.config.dropbox.key});

                client.onError.addListener(function(error) {
                    UI.displayError(error);
                });

                client.authenticate(function(error, client) {
                    if (error) {
                        UI.displayError(error);
                    }

                    var filename = '/' + file.name;

                    client.writeFile(filename, file , function(error, status) {
                        if (error) {
                            UI.displayError(error);
                        }

                        client.makeUrl(filename, {download: true}, function (error, shareUrl) {
                            iAmTheClientThatSendFile = true;
                            core.sendUploadedFileUrl(shareUrl.url);
                        });
                    });
                });
            };

            var divideFileInParts = function (file, callback) {
                app.UI.components.progress.show();
                app.UI.components.progressBar.width('0%');
                app.UI.components.progressBar.html('0%');
                app.UI.components.urlUploadedFile.html('');

                var chunkSize = 4096,
                    size = file.size,
                    offset = 0,
                    chunk = file.slice(offset, offset + chunkSize);

                var hashChunk = function() {
                    var reader = new FileReader({ 'blob': true });

                    reader.onload = function(e) {
                        offset += chunkSize;
                        
                        var percentLoaded = Math.round((offset / size) * 100);
                        if (percentLoaded < 100) {
                            app.UI.components.progressBar.width(percentLoaded + '%');
                            app.UI.components.progressBar.html(percentLoaded + '%');
                        }

                        if (offset < size) {
                            chunk = file.slice(offset, offset + chunkSize);
                            hashChunk();
                        }
                        else {
                            callback.call(this);
                        }
                    };

                    reader.onerror = function (evt) {
                        UI.displayError(evt);
                    };

                    reader.readAsArrayBuffer(chunk);
                };

                hashChunk();
            };

            divideFileInParts(file, send);

        }
    };

    return app;

}(app || {}));