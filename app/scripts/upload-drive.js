var app = (function (app) {
    'use strict';

    var UI = app.UI,
        core = app.core,
        SCOPES = 'https://www.googleapis.com/auth/drive',
        iAmTheClientThatSendFile = false;

    var handleAuthResult = function (authResult) {
        var cssHideClass = 'hide';
        if (authResult && !authResult.error) {
            UI.components.txtFile.removeClass(cssHideClass);
            UI.components.btnAuthenticate.addClass(cssHideClass);
            UI.components.btnUpload.removeClass(cssHideClass);
            UI.components.btnUpload.on('click', app.upload.sendToDrive);
        }
        else {
            UI.components.btnUpload.addClass(cssHideClass);
            UI.components.txtFile.addClass(cssHideClass);
            UI.components.btnAuthenticate.removeClass(cssHideClass);
            UI.components.btnAuthenticate.on('click', function () {
                gapi.auth.authorize({'client_id': app.config.keys.drive, 'scope': SCOPES, 'immediate': false}, handleAuthResult);
            });
        }
    };

    app.upload = {

        checkAuth: function () {
            gapi.auth.authorize({'client_id': app.config.keys.drive, 'scope': SCOPES, 'immediate': true}, handleAuthResult);
        },

        sendToDrive: function () {
            //var file = e.target.files[0];
            var file = document.querySelector('#txtFile').files[0];

            var insertPermission = function (fileId, value, type, role) {
                var body = {'value': value, 'type': type, 'role': role},
                    request = gapi.client.drive.permissions.insert({'fileId': fileId, 'resource': body});

                request.execute(function(resp) { 
                    app.UI.components.progress.hide();
                });
            };

            var insertFile = function (fileData, callback) {
                var boundary = '-------314159265358979323846',
                    delimiter = "\r\n--" + boundary + "\r\n",
                    close_delim = "\r\n--" + boundary + "--";

                var reader = new FileReader();
                reader.readAsBinaryString(fileData);
                reader.onload = function (e) {
                    var contentType = fileData.type || 'application/octet-stream';
                    var metadata = {
                        'title': fileData.name,
                        'mimeType': contentType
                    };

                    var base64Data = btoa(reader.result);
                    var multipartRequestBody =
                        delimiter +
                        'Content-Type: application/json\r\n\r\n' +
                        JSON.stringify(metadata) +
                        delimiter +
                        'Content-Type: ' + contentType + '\r\n' +
                        'Content-Transfer-Encoding: base64\r\n' +
                        '\r\n' +
                        base64Data +
                        close_delim;

                    var request = gapi.client.request({
                        'path': '/upload/drive/v2/files',
                        'method': 'POST',
                        'params': {'uploadType': 'multipart'},
                        'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
                        'body': multipartRequestBody
                    });

                    request.execute(callback);
                };
                
            };

            app.UI.components.progress.show();
            app.UI.components.urlUploadedFile.html('');

            
            gapi.client.load('drive', 'v2', function() {
                insertFile(file, function(data) {
                    core.sendUploadedFile({
                        filename: data.title || data.originalFilename,
                        url: data.webContentLink
                    });
                    insertPermission(data.id, '', 'anyone', 'reader');
                });
            });

        }
    };

    return app;

}(app || {}));
