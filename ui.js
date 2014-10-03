var app = (function (app) {
    'use strict';

    var subpages = {
        home: {
            button: $('.button.home'),
            content: $('.home')
        },
        message: {
            button: $('.button.chat'),
            content: $('.message')
        },
        upload: {
            button: $('.button.paper'),
            content: $('.upload')
        },
        about: {
            button: $('.button.info'),
            content: $('.about')
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
        topBar: $('#topBar'),
        uploadPanel: $('#uploadPanel'),
        file: $('#txtFile'),
        progress: $('#progress'),
        progressBar: $('#progress > .progress\-bar'),
        urlUploadedFile: $('#urlUploadedFile'),
        txtRoom: $('#txtRoom'),
        btnEnter: $('#btnEnter'),
        btnClearMessage: $('#btnClearMessage'),
        btnCopyMessage: $('#btnCopyMessage'),
        btnUploadDropbox: $('#btnUploadDropbox')
    };

    var view = function (evt) {
        components.buttons.removeClass('selected');
        evt.data.subpage.button.addClass('selected');
        components.subpages.addClass('hide');
        evt.data.subpage.content.removeClass('hide');
    };

    app.UI = {

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
                components.textarea.focus();
            });

            components.btnCopyMessage.on('click', function () {
                prompt('Copy...', components.textarea.val());
            });

            components.btnUploadDropbox.on('click', app.upload.sendToDropbox);
        },

        afterConnect: function () {
            app.UI.enableAllMenuButtons();
            app.UI.addMenuButtonsEvents();
            app.UI.displayConnectedIcon();
            app.UI.addButtonsEvents();
            app.UI.components.content.show();
            app.UI.components.footer.show();
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
            }, app.config.intervals.reconnect)
        }

    };
    
    return app;
    
}(app || {}));