var app = (function (app) {

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

        socket.on('upload', function (url) {
            var uri = _decode(url);
            if (iAmTheClientThatSendFile) {
                app.UI.components.progressBar.width('100%');
                app.UI.components.progressBar.html('100%');
            }
            app.UI.components.urlUploadedFile.html('<a href="' + uri + '" title="' + uri + '" target="_blank">' + uri + '</a>');
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

    var sendUploadedFileUrl = function (url) {
        socket.emit('upload', { 'room': config.room, 'url': _encode(url) });
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
            app.UI.components.txtRoom.val(createRandomRoom());
            app.UI.components.btnEnter.on('click', enterRoom);
            app.upload.checkAuth();
        },
        
        sendUploadedFileUrl: sendUploadedFileUrl
    };

    return app;

}(app || {}));
