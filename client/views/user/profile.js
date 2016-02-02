// Pages Profile

// Helper
Template.userProfile.helpers({

});

// Events
Template.userProfile.events({
    'click #btn-profile-edit': function() {
        event.preventDefault();

        console.log('E - click #btn-profile-edit');

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