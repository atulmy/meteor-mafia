// Pages Getaways

// Helper
Template.pagesHome.helpers({

});

// Events
Template.pagesHome.events({

});

// On Render
Template.pagesHome.rendered = function () {
    $( function() {
        App.init();
    });
};