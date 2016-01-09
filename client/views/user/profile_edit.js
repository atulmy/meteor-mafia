// Pages Profile

// Helper
Template.userProfileEdit.helpers({

});

// Events
Template.userProfileEdit.events({

});

// On Render
Template.userProfileEdit.rendered = function() {
    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};