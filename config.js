var app = app || {};

(function () {
    'use strict';

    app.config = {
        room: '',
        URL: 'http://localhost:3000/beta',
        intervals: {
            sendMessage: 2000,
            reconnect: 2000
        },
        dropbox: {
            key: 'ta834kszii6ohq5'
        }
    };

})();