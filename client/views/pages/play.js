// Pages Play

// Helper
Template.pagesPlay.helpers({
    game: function() {
        return Games.findOne({_id: Session.get('gameId')});
    },
    canInvite: function() {
        return Meteor.isCordova;
    }
});

// Events
Template.pagesPlay.events({
    'click #game-invite': function(event, template) {
        event.preventDefault();

        console.log('E - click #game-invite');

        var game = Games.findOne({_id: Session.get('gameId')});

        if(Meteor.isCordova) {
            var message = 'Join us in the game of Mafia!';
            var subject = 'Mafia in'+game.city.name+'. Code is '+game.city.code;
            var image = 'http://www.clker.com/cliparts/2/4/r/8/g/9/deep-fried-man-portrait-real-name-daniel-friedman-south-african-comedian-md.png';
            var link = 'http://app.mafia.atulmy.com/play/'+Session.get('gameId');
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