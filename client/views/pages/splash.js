// Pages Home

// Helper
Template.pagesSplash.helpers({

});

// Events
Template.pagesSplash.events({

});

// On Render
Template.pagesSplash.rendered = function () {
    $( function() {
        App.Materialize.Init.slider();

        // Redirect to Getaways
        Meteor.setTimeout(function(){
            // Router.go('home');
        }, 18000);
    });
};