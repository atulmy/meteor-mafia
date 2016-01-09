// Common Header

// Helper
Template.commonHeader.helpers({

});

// Events
Template.commonHeader.events({

});

// On Render
Template.commonHeader.rendered = function() {
    $( function() {
        $(".button-collapse").sideNav();
        $('.side-nav').on('click', function() {
            $('.button-collapse').sideNav('hide');
        });
    });
};