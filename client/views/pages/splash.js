// Pages Splash

// Helper
Template.pagesSplash.helpers({

});

// Events
Template.pagesSplash.events({

});

// On Render
Template.pagesSplash.rendered = function () {
    console.log('R - Template.pagesSplash.rendered');

    $( function() {
        App.Materialize.Init.slider();

        // Redirect to Home
        Meteor.setTimeout(function(){
            Router.go('home');
        }, 18000);
    });
};