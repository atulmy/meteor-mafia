// Pages Profile

// Helper
Template.userProfile.helpers({

});

// Events
Template.userProfile.events({

});

// On Render
Template.userProfile.rendered = function() {
    console.log('R - Template.userProfile.rendered');

    $( function() {
        App.init();
    });
};