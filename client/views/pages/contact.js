// Pages Join

// Helper
Template.pagesContact.helpers({

});

// Events
Template.pagesContact.events({

});

// On Render
Template.pagesContact.rendered = function () {
    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};