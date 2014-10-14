var app = (function (app) {
    'use strict';

    app.config = {
        room: '',
        URL: 'http://1clipboard.net:3001/beta',
        intervals: {
            sendMessage: 2000,
            reconnect: 2000
        },
        keys: {
            dropbox: 'ta834kszii6ohq5',
            drive: '729530664624-me2261q5maha5htl1egovh6m95iasckg.apps.googleusercontent.com'
        }
    };

    return app;

}(app || {}));