// Pages About

// Helper
Template.pagesHow.helpers({

});

// Events
Template.pagesHow.events({

});

// On Render
Template.pagesHow.rendered = function() {
    console.log('R - Template.pagesHow.rendered');

    $( function() {
        App.init();
    });
};