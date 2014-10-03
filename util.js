var app = (function (app) {
    'use strict';

    app.util = {
        encode: function (message) {
            var m = message;
            try {
                m = encodeURIComponent(JSON.stringify(message));
            }
            catch (e) {}
            return m;
        },

        decode: function (message) {
            var m = message;
            try {
                m = JSON.parse(decodeURIComponent(message))
            }
            catch (e) {}
            return m;
        }
    };

    return app;

}(app || {}));