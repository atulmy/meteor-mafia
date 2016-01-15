// Pages Profile

// Helper
Template.userProfile.helpers({

});

// Events
Template.userProfile.events({
    'click #profile-logout': function() {
        event.preventDefault();

        console.log('E - click #profile-logout');

        // Show action loading
        App.Helpers.actionLoading('#profile-logout', 'before');

        AccountsTemplates.logout();
    }
});

// On Render
Template.userProfile.rendered = function() {
    console.log('R - Template.userProfile.rendered');

    $( function() {
        App.init();
    });
};