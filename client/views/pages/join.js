// Pages Join

// Helper
Template.pagesJoin.helpers({

});

// Events
Template.pagesJoin.events({

});

// On Render
Template.pagesJoin.rendered = function () {
    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};