// Pages Goodbye

// Helper
Template.pagesGoodbye.helpers({

});

// Events
Template.pagesGoodbye.events({

});

// On Render
Template.pagesGoodbye.rendered = function() {
    console.log('R - Template.pagesGoodbye.rendered');

    $( function() {
        App.init();
    });

    if(Meteor.isCordova) {
        setTimeout(function() {
            navigator.app.exitApp();
        }, 2000);
    }
};