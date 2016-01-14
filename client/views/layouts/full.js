// Layouts Full

// Helper
Template.layoutsFull.helpers({

});

// Events
Template.layoutsFull.events({

});

// On Render
Template.layoutsFull.rendered = function() {
    console.log('R - Template.layoutsFull.rendered');

    $( function() {
        App.Layouts.full();
    });
};