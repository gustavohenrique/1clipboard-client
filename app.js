'use strict';

var config = {
    room: window.location.href.split('?')[1] || '',
    URL: 'http://1clipboard.net/beta',
    intervals: {
        sendMessage: 2000,
        reconnect: 2000
    },
    dropbox: {
        key: 'ta834kszii6ohq5'
    }
};

var components = {
    textarea: $('#message'),
    errorPanel: $('#errorPanel'),
    errorMessage: $('#errorMessage'),
    successPanel: $('#successPanel'),
    topBar: $('#topBar'),
    footer: $('footer'),
    uploadPanel: $('#uploadPanel'),
    file: $('#file'),
    progress: $('#progress'),
    progressBar: $('#progress > .progress\-bar'),
    urlUploadedFile: $('#urlUploadedFile')
};

var _encode = function (message) {
    var m = message;
    try {
        m = encodeURIComponent(JSON.stringify(message));
    }
    catch (e) {}
    return m;
};

var _decode = function (message) {
    var m = message;
    try {
        m = JSON.parse(decodeURIComponent(message))
    }
    catch (e) {}
    return m;
};

var iAmTheClientThatSendFile = false;

var app = {

    timer: null,

    connect: function () {
        socket.emit('enter', config.room);

        socket.on('clipboard', function (message) {
            components.textarea.val(_decode(message));
        });

        socket.on('upload', function (url) {
            var uri = _decode(url);
            if (iAmTheClientThatSendFile) {
                components.progressBar.width('100%');
                components.progressBar.html('100%');
            }
            components.urlUploadedFile.html('<a href="' + uri + '" title="' + uri + '" target="_blank">' + uri + '</a>');
        });

        socket.on('discover', function (roomName) {
            components.footer.show();
            components.uploadPanel.show();
            config.room = roomName;
            document.getElementById('room').innerHTML = config.room;
        });
    },

    error: function () {
        app.showError('Connection error. Check if you are on-line and no firewall is blocking you.');
    },

    showError: function (error) {
        components.errorPanel.show();
        components.errorMessage.html(error);
        components.successPanel.hide();
        components.uploadPanel.hide();
        components.textarea.hide();
        components.footer.hide();
    },

    reconnect: function () {
        components.errorPanel.hide();
        components.uploadPanel.hide();
        components.successPanel.show();
        setTimeout(function () {
            components.footer.show();
            components.successPanel.hide();
            components.textarea.show();
            components.textarea.focus();
            components.uploadPanel.show();
        }, config.intervals.reconnect)
    },

    sendMessage: function () {
        var message = components.textarea.val();
        if (message !== '') {
            socket.emit('clipboard', { 'room': config.room, 'message': _encode(message) });
        }
    },

    sendUrl: function (url) {
        socket.emit('upload', { 'room': config.room, 'url': _encode(url) });
    },

    clearMessage: function () {
        components.textarea.val('');
        components.textarea.focus();
    },

    selectAll: function () {
        components.textarea.focus();
        document.getElementById('message').setSelectionRange(0, components.textarea.val().length);
    },

    resizeComponents: function () {
        var w =$(window),
            footerHeight = $('.footer').height(),
            height = w.height() - components.topBar.height() - footerHeight - (components.uploadPanel.height() + 30),
            width = w.width();

        var getScrollBarWidth = function () {
            var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
                widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).width();
                $outer.remove();
            return 100 - widthWithScroll;
        };

        components.textarea.css('min-height', height - 20);
        components.textarea.css('min-width', width - getScrollBarWidth() - 5);
    },

    startTimer: function () {
        clearTimeout(app.timer);
        app.timer = setTimeout(app.sendMessage, config.intervals.sendMessage);
    },

    stopTimer: function () {
        clearTimeout(app.timer);
    },

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
            components.progress.show();
            components.progressBar.width('0%');
            components.progressBar.html('0%');
            components.urlUploadedFile.html('');

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
                        components.progressBar.width(percentLoaded + '%');
                        components.progressBar.html(percentLoaded + '%');
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


var socket = io(config.URL, {reconnectionDelay: config.intervals.reconnect});
socket.on('connection', app.connect);
socket.on('connect_error', app.error);
socket.on('reconnect', app.reconnect);

components.textarea.on('keyup', app.startTimer);
components.textarea.on('keydown', app.stopTimer);
components.textarea.on('paste', app.startTimer);

window.onload = function () {
    app.resizeComponents();
    components.textarea.focus();
};

window.onresize = function () {
    app.resizeComponents();
};

components.file.on('change', app.upload);

