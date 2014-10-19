var app = (function (app) {

    'use strict';

    var config = app.config,
        _decode = app.util.decode,
        _encode = app.util.encode,
        iAmTheClientThatSendFile = false,
        timer = null,
        socket = null;

    var onConnect = function () {
        socket.emit('enter', config.room);

        socket.on('clipboard', function (message) {
            app.UI.components.textarea.val(_decode(message));
            app.UI.subpages.message.button.trigger('click');
        });

        socket.on('upload', function (file) {
            var uri = _decode(file.url),
                filename = _decode(file.filename);

            if (iAmTheClientThatSendFile) {
                app.UI.components.progressBar.width('100%');
                app.UI.components.progressBar.html('100%');
            }
            app.UI.components.urlUploadedFile.html('<a href="' + uri + '" title="Download" target="_blank">' + filename + '</a>');
        });

        socket.on('discover', function (roomName) {
            app.UI.afterConnect();
            config.room = roomName;
        });
    };

    var onError = function () {
        app.UI.displayError('Connection error. Check if you are on-line and no firewall is blocking you.');
    };

    var onReconnect = function () {
        app.UI.displayReconnect();
    };

    var sendMessage = function () {
        var message = app.UI.components.textarea.val();
        if (message !== '') {
            socket.emit('clipboard', { 'room': config.room, 'message': _encode(message) });
        }
    };

    var sendUploadedFile = function (file) {
        socket.emit('upload', { 'room': config.room, 'file': { filename: _encode(file.filename), url: _encode(file.url) } });
    };

    var startTimer = function () {
        clearTimeout(timer);
        timer = setTimeout(sendMessage, config.intervals.sendMessage);
    };

    var stopTimer = function () {
        clearTimeout(timer);
    };

    var enterRoom = function () {
        var room = app.UI.components.txtRoom.val();
        if (room !== undefined && room !== '') {
            localStorage.setItem('1clipboard.roomName', room);
            config.room = room;
            if (socket !== null) {
                socket.emit('enter', room);
            }
            else {
                socket = io(config.URL, {reconnectionDelay: config.intervals.reconnect});
            }
            socket.on('connection', onConnect);
            socket.on('connect_error', onError);
            socket.on('reconnect', onReconnect);

            app.UI.components.textarea.on('keyup', startTimer);
            app.UI.components.textarea.on('keydown', stopTimer);
            app.UI.components.textarea.on('paste', startTimer);
        }
    };

    var connectAutomatically = function () {
        try {
            var roomName = localStorage.getItem('1clipboard.roomName');
            app.UI.components.txtRoom.val(roomName);
            enterRoom();
        }
        catch (e) {
            // browser does not support Storage
        }
    }

    app.core = {
        start: function () {
            var createRandomRoom = function () {
                var room = '',
                    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

                for (var i=0; i < 5; i++ ) {
                    room += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                return room;
            };
            app.UI.components.btnSuggest.on('click', function () {
                app.UI.components.txtRoom.val(createRandomRoom());
            });
            app.UI.components.btnEnter.on('click', enterRoom);
            connectAutomatically();
            app.upload.checkAuth();
        },
        
        sendUploadedFile: sendUploadedFile
    };

    return app;

}(app || {}));
