
/*
        upload: function (e) {
            var file = e.target.files[0];

            var sendToDropbox = function() {
                var client = new Dropbox.Client({key: config.dropbox.key});

                client.onError.addListener(function(error) {
                    app.showError(error);
                });

                client.authenticate(function(error, client) {
                    if (error) {
                        app.showError(error);
                    }

                    var filename = '/' + file.name;

                    client.writeFile(filename, file , function(error, status) {
                        if (error) {
                            app.showError(error);
                        }

                        client.makeUrl(filename, {download: true}, function (error, shareUrl) {
                            iAmTheClientThatSendFile = true;
                            app.sendUrl(shareUrl.url);
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
                        app.showError(evt);
                    };

                    reader.readAsArrayBuffer(chunk);
                };

                hashChunk();
            };

            divideFileInParts(file, sendToDropbox);

        }
    };
*/