App = {
    Defaults: {
        toastTime: 4000,
        overlayTime: 4000,
        messages: {
            'error': '<i class="material-icons left">error_outline</i> There was some error. Please try again'
        },
        cities: [
            'London',
            'New York',
            'Paris',
            'Mumbai',
            'Singapore',
            'Barcelona',
            'Bangkok',
            'Rome',
            'Dubai',
            'Istanbul'
        ],
        characters: [
            {title: 'Citizen', 'icon': '<i class="material-icons left mr5 deep-orange-text text-darken-2">people</i>'},  // 0
            {title: 'Mafia', 'icon': '<img src="/images/logo.png" alt="Mafia" class="circle responsive-img left mr5" style="width: 24px;">'},  // 1
            {title: 'Doctor', 'icon': '<i class="material-icons left mr5 green-text text-darken-2">add_circle</i>'},  // 2
            {title: 'Detective', 'icon': '<i class="material-icons left mr5 indigo-text text-darken-2">search</i>'},  // 3
        ]
    },

    init: function() {
        // Common Page Animation
        $('.animate-fade-in').fadeIn();

        // Focused
        $('body').removeClass('focused');
        var selector = "input[type='text'], textarea, input[type='password'], input[type='email'], input[type='number']";
        $(selector).focusin(function() {
            console.log($(this).attr('id'));
            $('body').addClass('focused');
        });
        $(selector).blur(function() {
            console.log($(this).attr('id'));
            setTimeout(function() {
                $('body').removeClass('focused');
            }, 500);
        });
    },

    User: {
        loginOrCreate: function(uuid) {
            Meteor.loginWithPassword({username: uuid}, uuid, function (err) {
                if (err) {
                    console.log('User - Create');

                    Meteor.call('userCreate', uuid);

                    console.log(Meteor.loginWithPassword({username: uuid}, uuid, function (err) {
                        if (err) {
                            console.log('User - Error Logging In');
                        }
                        else {
                            console.log('User - Logged In');
                        }
                    }));
                } else {
                    console.log('User - Logged In');
                }
            });
        }
    },

    Layouts: {
        default: function() {
            /*
            var heightApp = parseInt($(document).height());
            $('#app-wrapper').height(heightApp);
            var heightAppHeader = $('#app-header').height();
            var heightAppFooter = $('#app-footer').height();
            $('#app-content').height(heightApp - (heightAppHeader + heightAppFooter));
            */
        },

        full: function() {
            //var heightApp = $(window).height();
            //$('#app-wrapper').height(heightApp);
        }
    },

    Materialize: {
        Init: {
            sideNav: function() {
                $('.button-collapse').sideNav();
                $('.side-nav').on('click', function() {
                    $('.button-collapse').sideNav('hide');
                });
            },

            modal: function() {
                $('.modal-trigger').leanModal();
            },

            form: function() {
                $('select').material_select();
            },

            slider: function() {
                $('.slider').slider({full_width: true});
            },

            tabs: function() {
                $('ul.tabs').tabs();
            },

            dropdown: function() {
                $('.dropdown-button').dropdown();
            }
        }
    },

    Overlay: {
        show: function(text, display, time) {
            $('#notify .notify-message p .normal').html('').hide();
            $('#notify .notify-message p .pulse').html('').hide();

            $('#notify .notify-message p .'+display).html(text).show();
            $('#notify').fadeIn();

            setTimeout(function() {
                App.Overlay.hide();
            }, time, text);
        },

        hide: function() {
            $('#notify').fadeOut();
        }
    },

    Helpers: {
        randomNumber: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        actionLoading: function(button, isBeforeAfter) {
            if(isBeforeAfter == 'before') {
                $(button).prop('disabled', true);
                $(button).find('.action-text').hide();
                $(button).find('.action-loading').fadeIn();
                $(button).find('.action-loading .preloader-wrapper').addClass('active');
                $('.header-action').hide();
                $('.header-action-loading').fadeIn();
            } else {
                $(button).prop('disabled', false);
                $(button).find('.action-loading .preloader-wrapper').removeClass('active');
                $(button).find('.action-loading').hide();
                $(button).find('.action-text').fadeIn();
                $('.header-action-loading').hide();
                $('.header-action').fadeIn();
            }
        },

        actionDisable: function(button, isBeforeAfter) {
            if(isBeforeAfter == 'before') {
                $(button).prop('disabled', true);
            } else {
                $(button).prop('disabled', false);
            }
        },

        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
};