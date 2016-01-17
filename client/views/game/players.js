// Game Players

// Helper
Template.gamePlayers.helpers({
    game: function() {
        return Games.findOne({_id: Session.get('gameId')});
    },
    canInvite: function() {
        return Meteor.isCordova;
    },
    canStart: function() {
        var game = Games.findOne({_id: Session.get('gameId')});

        var allReady = true;
        game.players.list.forEach(function(v) {
            if(v.ready == false) {
                allReady = false;
            }
        });

        return (game.players.joined >= 6) && allReady;
    },
    started: function() {
        var game = Games.findOne({_id: Session.get('gameId')});

        if(game.is.started) {
            Router.go('gamePlay', {gameId: game._id});
        }

        return false;
    }
});

// Events
Template.gamePlayers.events({
    'click #game-start': function(event, template) {
        console.log('E - click #game-start');

        var game = Games.findOne({_id: Session.get('gameId')});
        if(game) {
            var input = {key: "started", value: true, gameId: game._id};
            Meteor.call('gameStart', input, function (error, response) {
                console.log('M - gameStart');

                if(error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    Materialize.toast(response.message, App.Defaults.toastTime);

                    if(response.success) {
                        Router.go('gamePlay', {gameId: game._id});
                    }
                }
            });
        }
    },

    'click #game-started': function(event, template) {
        console.log('E - click #game-started');

        var game = Games.findOne({_id: Session.get('gameId')});

        if(game.is.started) {
            Router.go('gamePlay', {gameId: game._id});
        }
    },

    'click #game-ready': function(event, template) {
        console.log('E - click #game-ready');

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
    }
});

// On Render
Template.gamePlayers.rendered = function() {
    console.log('R - Template.gamePlayers.rendered');

    var game = Games.findOne({_id: Session.get('gameId')});

    if(game.is.started) {
        Router.go('home');
    }

    $( function() {
        App.init();
        App.Materialize.Init.modal();
    });
};