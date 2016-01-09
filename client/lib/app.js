App = {
    init: function() {
        // Common Page Animation
        $('.animate-fade-in').fadeIn();
        $('.drag-target').remove()
        $(".button-collapse").sideNav();
    },

    Materialize: {
        Init: {
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