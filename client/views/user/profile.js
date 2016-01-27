// Pages Profile

// Helper
Template.userProfile.helpers({

});

// Events
Template.userProfile.events({
    'click #profile-edit': function() {
        event.preventDefault();

        console.log('E - click #profile-edit');

        // Show action loading
        App.Helpers.actionLoading('#profile-logout', 'before');

        Router.go('profileEdit');
    }
});

// On Render
Template.userProfile.rendered = function() {
    console.log('R - Template.userProfile.rendered');

    $( function() {
        App.init();
    });
};