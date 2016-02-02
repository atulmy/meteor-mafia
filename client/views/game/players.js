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

        return (game.players.joined >= 4) && allReady;
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

                        // Notifications - Round 1
                        Meteor.setTimeout(function() {
                        }, 2000);

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
            // Show action loading
            App.Helpers.actionLoading('#game-invite', 'before');

            var message = 'Mafia in '+game.city.name+'! Code: '+game.city.code;
            var subject = 'Join us and save the city!';
            var image = 'http://mafia.atulmy.com/static/images/ic_launcher.png';
            var link = 'http://mafia.atulmy.com/';
            window.plugins.socialsharing.share(
                message,
                subject,
                image,
                link
            );

            setTimeout(function() {
                App.Helpers.actionLoading('#game-invite', 'after');
            }, 2000);
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

// On Create
Template.gamePlayers.onCreated(function () {
    console.log('R - Template.gamePlayers.created');

    var self = this;
    self.autorun(function () {
        // Notifications
        var notifications = Notifications.find();
        notifications.observeChanges({
            added: function(id, obj) {
                if(obj.type == 'overlay') {
                    App.Overlay.show(obj.text, 'pulse', App.Defaults.overlayTime);
                } else {
                    if(obj.by != Meteor.userId()) {
                        Materialize.toast(obj.text, App.Defaults.toastTime);
                    }
                }
            }
        });
    });
});