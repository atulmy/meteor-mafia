// Pages Profile

// Helper
Template.userProfile.helpers({

});

// Events
Template.userProfile.events({

});

// On Render
Template.userProfile.rendered = function() {
    $( function() {
        App.init();
        App.Materialize.Init.modal();
        App.Materialize.Init.form();
    });
};