App = {
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
    }
};