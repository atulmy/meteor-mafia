App = {
    Defaults: {
        toastTime: 4000,
        cities: [
            'London',
            'New York',
            'Paris',
            'Mumbai',
            'Singapore',
            'Barcelona',
            'Bangkok',
            'Kuala Lumpur',
            'Dubai',
            'Istanbul'
        ]
    },

    init: function() {
        // Common Page Animation
        $('.animate-fade-in').fadeIn();
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
            }
        }
    },

    Helpers: {
        randomNumber: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        actionLoading: function(button, isBeforeAfter) {
            if(isBeforeAfter == 'before') {
                $(button).attr('disabled', 'disabled')
                $(button).find('.action-text').hide();
                $(button).find('.action-loading').fadeIn();
                $(button).find('.action-loading .preloader-wrapper').addClass('active');
                $('.header-action').hide();
                $('.header-action-loading').fadeIn();
            } else {
                $(button).removeAttr('disabled');
                $(button).find('.action-loading .preloader-wrapper').removeClass('active');
                $(button).find('.action-loading').hide();
                $(button).find('.action-text').fadeIn();
                $('.header-action-loading').hide();
                $('.header-action').fadeIn();
            }
        }
    }
};