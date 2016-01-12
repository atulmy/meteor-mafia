// Pages Play

// Helper
Template.pagesPlay.helpers({
    game: function() {
        return Games.findOne({_id: Session.get('gameId')});
    },
});

// Events
Template.pagesPlay.events({
    'click .share': function(event, template) {
        event.preventDefault();
        if (Meteor.isCordova) {
            var message = 'This is the message!';
            var subject = 'A subject for my message';
            var image = 'https://pedlar.co/pedlar.png';
            var link = 'https://pedlar.co';
            window.plugins.socialsharing.share(
                message,
                subject,
                image,
                link
            );
        }
    }
});

// On Render
Template.pagesPlay.rendered = function() {
    console.log('R - Template.pagesPlay.rendered');

    $( function() {
        App.init();
    });
};