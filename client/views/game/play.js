// Game Play

// Helper
Template.gamePlay.helpers({
    game: function() {
        return Games.findOne({_id: Session.get('gameId')});
    },

    // Current Player
        currentPlayer: function() {
            var game = Games.findOne({_id: Session.get('gameId')});

            var currentPlayer = {};
            game.players.list.forEach(function(p) {
                if(p.id == Meteor.userId()) {
                    currentPlayer = p;
                }
            });

            return currentPlayer;
        },

        currentPlayerCharacterText: function(c) {
            return App.Defaults.characters[c].icon+' '+App.Defaults.characters[c].title;
        },

        currentPlayerAliveOrDeadText: function(aliveOrDead) {
            var alive = '<i class="material-icons left mr5 green-text text-darken-2">mood</i> Alive';
            var dead = '<i class="material-icons left mr5 red-text text-darken-2">mood_bad</i> Dead';
            return (aliveOrDead) ? alive : dead;
        },

    // Players
        playerAliveOrDead: function(aliveOrDead) {
            return (aliveOrDead) ? 'bg-game-player-alive' : 'bg-game-player-dead';
        }
});

// Events
Template.gamePlay.events({
    'click #game-started': function(event, template) {
        console.log('E - click .toggle-ready');

        var game = Games.findOne({_id: Session.get('gameId')});
    },

    'click #game-ready': function(event, template) {
        console.log('E - click .toggle-ready');

        // Get Inputs
        var input = {};
        input.ready = template.$(event.currentTarget).is(':checked');
        input.gameId = Session.get('gameId');
        console.log(input);

        Meteor.call('gameToggleReady', input, function (error, response) {
            console.log('M - gameToggleReady');

            if(error) {
                Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
            } else {
                Materialize.toast(response.message, App.Defaults.toastTime);
            }
        });
    },

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
    },

    'submit #form-game-discussion': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-game-discussion');

        // Show action loading
        App.Helpers.actionLoading('#form-game-discussion-submit', 'before');

        // Get Inputs
        var input = {};
        input.message = template.$('#form-game-discussion-message').val();
        input.gameId = Session.get('gameId');
        console.log(input);

        // Validate
        if(input.message != '') {
            Meteor.call('gameDiscussion', input, function (error, response) {
                console.log('M - gameDiscussion');

                App.Helpers.actionLoading('#form-game-discussion-submit', 'after');

                if (error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    if (response.success) {
                        template.$('#form-game-discussion-message').val('');
                    }
                }
            });
        } else {
            App.Helpers.actionLoading('#form-game-discussion-submit', 'after');

            Materialize.toast('Please provide message.', App.Defaults.toastTime);
        }
    },
});

// On Render
Template.gamePlay.rendered = function() {
    console.log('R - Template.gamePlay.rendered');

    // Check if user is a player in this game else @TODO
    // Router.go('join');

    $( function() {
        App.init();
        App.Materialize.Init.modal();
        App.Materialize.Init.tabs();
    });
};