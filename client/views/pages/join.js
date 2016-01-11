// Pages Join

// Helper
Template.pagesJoin.helpers({

});

// Events
Template.pagesJoin.events({

});

// On Render
Template.pagesJoin.rendered = function () {
    console.log('R - Template.pagesJoin.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};