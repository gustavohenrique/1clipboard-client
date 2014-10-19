var app = (function (app) {
    'use strict';

    var subpages = {
        home: {
            button: $('.button.home'),
            content: $('.home'),
            panel: $('.subpage.home > .panel')
        },
        message: {
            button: $('.button.chat'),
            content: $('.subpage.message')
        },
        upload: {
            button: $('.button.paper'),
            content: $('.subpage.upload')
        },
        about: {
            button: $('.button.info'),
            content: $('.subpage.about')
        }
    };

    var components = {
        content: $('.content'),
        footer: $('footer'),
        buttons: $('a.button'),
        subpages: $('.subpage'),
        statusConnectionIcon: $('#statusConnectionIcon'),
        textarea: $('#message'),
        errorPanel: $('#errorPanel'),
        errorMessage: $('#errorMessage'),
        successPanel: $('#successPanel'),
        connectionPanel: $('#connectionPanel'),
        topBar: $('#topBar'),
        uploadPanel: $('#uploadPanel'),
        progress: $('#progress'),
        urlUploadedFile: $('#urlUploadedFile'),
        txtRoom: $('#txtRoom'),
        btnEnter: $('#btnEnter'),
        btnSuggest: $('#btnSuggest'),
        btnClearMessage: $('#btnClearMessage'),
        btnCopyMessage: $('#btnCopyMessage'),
        btnAuthenticate: $('#btnAuthenticate'),
        btnUpload: $('#btnUpload'),
        txtFile: $('#txtFile')
    };

    var view = function (evt) {
        components.buttons.removeClass('selected');
        evt.data.subpage.button.addClass('selected');
        components.subpages.addClass('hide');
        evt.data.subpage.content.removeClass('hide');
    };

    app.UI = {

        subpages: subpages,

        components: components,

        enableAllMenuButtons: function () {
            components.buttons.removeClass('disabled');
        },

        addMenuButtonsEvents: function () {
            ['home', 'message', 'upload', 'about'].forEach(function (name) {
                subpages[name].button.on('click', {'subpage': subpages[name]}, view);
            });
        },

        displayDisconnectedIcon: function () {
            components.statusConnectionIcon.addClass('disconnected');
        },

        displayConnectedIcon: function () {
            components.statusConnectionIcon.removeClass('disconnected');
        },

        addButtonsEvents: function () {
            components.btnClearMessage.on('click', function () {
                components.textarea.val('');
            });

            components.btnCopyMessage.on('click', function () {
                prompt('Copy...', components.textarea.val());
            });

            //components.btnUpload.on('click', app.upload.sendToDropbox);
        },

        afterConnect: function () {
            app.UI.enableAllMenuButtons();
            app.UI.addMenuButtonsEvents();
            app.UI.displayConnectedIcon();
            app.UI.addButtonsEvents();
            app.UI.components.content.show();
            app.UI.components.footer.show();
            app.UI.subpages.home.panel.show();
            app.UI.components.connectionPanel.removeClass('hide');
            app.UI.components.connectionPanel.find('.room').html(app.config.room);
            app.UI.components.textarea.val('');
            app.UI.components.urlUploadedFile.html('');
        },

        displayError: function (message) {
            app.UI.displayDisconnectedIcon();
            app.UI.components.errorMessage.html(message);
            app.UI.components.errorPanel.show();
            app.UI.components.content.hide();
            app.UI.components.footer.hide();
        },

        displayReconnect: function () {
            app.UI.components.errorPanel.hide();
            app.UI.components.successPanel.show();
            setTimeout(function () {
                app.UI.components.successPanel.hide();
                app.UI.afterConnect();
            }, app.config.intervals.reconnect);
        }

    };
    
    return app;
    
}(app || {}));