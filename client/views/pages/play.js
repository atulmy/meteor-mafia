// Pages Play

// Helper
Template.pagesPlay.helpers({
    game: function() {
        return Games.findOne({_id: Session.get('gameId')});
    },
});

// Events
Template.pagesPlay.events({

});

// On Render
Template.pagesPlay.rendered = function() {
    console.log('R - Template.pagesPlay.rendered');

    $( function() {
        App.init();
    });
};