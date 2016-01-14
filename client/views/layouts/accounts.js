// Layouts Accounts

// Helper
Template.layoutsAccounts.helpers({

});

// Events
Template.layoutsAccounts.events({

});

// On Render
Template.layoutsAccounts.rendered = function() {
    console.log('R - Template.layoutsAccounts.rendered');

    $( function() {
        App.Layouts.default();
    });
};