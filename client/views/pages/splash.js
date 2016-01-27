// Pages Splash

// Helper
Template.pagesSplash.helpers({

});

// Events
Template.pagesSplash.events({
    'click .splash-start': function(event, template) {
        event.preventDefault();

        console.log('M - click .splash-start');

        if(Meteor.user().profile.image.id == 'default-user-image') {
            Router.go('profileDefault');
        } else {
            Router.go('home');
        }
    }
});

// On Render
Template.pagesSplash.rendered = function () {
    console.log('R - Template.pagesSplash.rendered');

    Session.setPersistent('splash', 1);

    $( function() {
        App.Materialize.Init.slider();

        // Redirect to Home
        Meteor.setTimeout(function(){
            // Router.go('home');
        }, 18000);
    });
};