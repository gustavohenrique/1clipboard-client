(function () {
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
        buttons: $('a.button'),
        subpages: $('.subpage')
    };

    var view = function (evt) {
        components.buttons.removeClass('selected');
        evt.data.subpage.button.addClass('selected');
        components.subpages.addClass('hide');
        evt.data.subpage.content.removeClass('hide');
    };

    ['home', 'message', 'upload', 'about'].forEach(function (name) {
        subpages[name].button.on('click', {'subpage': subpages[name]}, view);
    });

    
    
})();