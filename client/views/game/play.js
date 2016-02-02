// Game Play

// Helper
Template.gamePlay.helpers({
    canExit: function() {
        return Meteor.isCordova;
    },

    // Game
        game: function() {
            return Games.findOne({_id: Session.get('gameId')});
        },

        gameRoundNumber: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return game.rounds.length;
            }
            return 1;
        },

        gameVotesAgainstPlayerShow: function(playerKey) {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return game.rounds[game.rounds.length - 1].votes[playerKey].self > 0;
            }
        },

        gameVotesAgainstPlayer: function(playerKey) {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return game.rounds[game.rounds.length - 1].votes[playerKey].self;
            }
        },

        gameFinishedText: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                var text = 'Citizens Won';

                game.players.list.forEach(function(p) {
                    if(p.character == 1 && p.alive) { // Mafia
                        text = 'Mafia Won';
                    }
                });

                return text;
            }
        },


    // Game Actions
        gameActionKillDisable: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].mafia.done) ? 'disabled' : '';
            }
        },

        gameActionKillText: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].mafia.done) ? '' : ' &bull; Kill Someone';
            }
        },

        gameActionSaveDisable: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].doctor.done) ? 'disabled' : '';
            }
        },

        gameActionCanSave: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return !(game.rounds[game.rounds.length - 1].doctor.done);
            }
        },

        gameActionSaveText: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].doctor.done) ? '' : ' &bull; Save Someone';
            }
        },

        gameActionInvestigateDisable: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].detective.done) ? 'disabled' : '';
            }
        },

        gameActionInvestigateText: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].detective.done) ? '' : ' &bull; Investigate Someone';
            }
        },

        gameActionVoteDisable: function() {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].votingEnabled) ? '' : 'disabled';
            }
        },

        gameActionVoteText: function(currentPlayerKey) {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                if(game.rounds[game.rounds.length - 1].votes[currentPlayerKey].done) {
                    return ' &bull; Voted';
                }
                return (game.rounds[game.rounds.length - 1].votingEnabled) ? ' &bull; Discuss &amp; Vote for Mafia' : '';
            }
        },

        gameActionVoteDoneDisable: function(currentPlayerKey) {
            var game = Games.findOne({_id: Session.get('gameId')});
            if(game) {
                return (game.rounds[game.rounds.length - 1].votes[currentPlayerKey].done) ? 'disabled' : '';
            }
        },

    // Current Player
        currentPlayer: function() {
            var game = Games.findOne({_id: Session.get('gameId')});

            var currentPlayer = {};
            game.players.list.forEach(function(p, index) {
                if(p.id == Meteor.userId()) {
                    currentPlayer = p;
                    currentPlayer.key = index;
                }
            });

            return currentPlayer;
        },

        currentPlayerIsCitizen: function(c) {
            return (c == 0) ? true : false;
        },

        currentPlayerIsMafia: function(c) {
            return (c == 1) ? true : false;
        },

        currentPlayerIsDoctor: function(c) {
            return (c == 2) ? true : false;
        },

        currentPlayerIsDetective: function(c) {
            return (c == 3) ? true : false;
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
        playerAliveOrDeadBg: function(aliveOrDead) {
            return (aliveOrDead) ? 'bg-game-player-alive' : 'bg-game-player-dead';
        },

        playerAliveOrDeadBtn: function(aliveOrDead) {
            return (aliveOrDead) ? '' : 'disabled';
        }
});

// Events
Template.gamePlay.events({
    'click #game-shield': function(event, template) {
        event.preventDefault();

        console.log('E - click #game-shield');

        if(template.$('#game-shield-overlay').is(':visible')) {
            template.$('#game-shield-overlay').fadeOut();
        } else {
            template.$('#game-shield-overlay').show();
        }
    },

    'click .game-paused': function(event, template) {
        event.preventDefault();

        console.log('E - click .game-paused');

        var input = {};
        input.pause = (parseInt(template.$(event.currentTarget).attr('pause'))) ? true : false;
        input.gameId = Session.get('gameId');

        Meteor.call('gameSettingsPause', input, function (error, response) {
            console.log('M - gameSettingsPause');
        });
    },

    'click #game-sound-toggle': function(event, template) {
        event.preventDefault();

        console.log('E - click #game-sound-toggle');

        var input = {};
        input.data = parseInt(template.$(event.currentTarget).attr('data'));
        input.gameId = Session.get('gameId');

        Meteor.call('gameSettingsSoundToggle', input, function (error, response) {
            console.log('M - gameSettingsSoundToggle');

            if (error) {
                Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
            } else {
                Materialize.toast(response.message, App.Defaults.toastTime);
            }
        });
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
        input.type = 'user';
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

            Materialize.toast('You did not enter any text.', App.Defaults.toastTime);
        }
    },

    'submit #form-game-discussion-mafia': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-game-discussion-mafia');

        // Show action loading
        App.Helpers.actionLoading('#form-game-discussion-mafia-submit', 'before');

        // Get Inputs
        var input = {};
        input.message = template.$('#form-game-discussion-mafia-message').val();
        input.gameId = Session.get('gameId');
        input.type = 'mafia';
        console.log(input);

        // Validate
        if(input.message != '') {
            Meteor.call('gameDiscussion', input, function (error, response) {
                console.log('M - gameDiscussion');

                App.Helpers.actionLoading('#form-game-discussion-mafia-submit', 'after');

                if (error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    if (response.success) {
                        template.$('#form-game-discussion-mafia-message').val('');
                    }
                }
            });
        } else {
            App.Helpers.actionLoading('#form-game-discussion-mafia-submit', 'after');

            Materialize.toast('You did not enter any text.', App.Defaults.toastTime);
        }
    },

    // Game Actions
        // All - Vote
        'click .game-action-vote': function(event, template) {
            event.preventDefault();

            console.log('E - click .game-action-vote');

            var input = {};
            input.data = parseInt(template.$(event.currentTarget).attr('data'));
            input.dataPlayerKey = parseInt(template.$(event.currentTarget).attr('data-current-player'));
            input.gameId = Session.get('gameId');
            console.log(input);

            if(input.gameId != '') {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'before');

                Meteor.call('gameActionVote', input, function (error, response) {
                    console.log('M - gameActionVote');

                    if (error) {
                        App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                        Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                    } else {
                        Materialize.toast(response.message, App.Defaults.toastTime);
                    }
                });
            } else {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                Materialize.toast('Some issue with the input.', App.Defaults.toastTime);
            }
        },

        // Mafia - Kill
        'click .game-action-kill': function(event, template) {
            event.preventDefault();

            console.log('E - click .game-action-kill');

            var input = {};
            input.data = parseInt(template.$(event.currentTarget).attr('data'));
            input.gameId = Session.get('gameId');
            console.log(input);

            if(input.gameId != '') {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'before');

                Meteor.call('gameActionKill', input, function (error, response) {
                    console.log('M - gameActionKill');

                    if (error) {
                        App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                        Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                    } else {
                        Materialize.toast(response.message, App.Defaults.toastTime);
                    }
                });
            } else {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                Materialize.toast('Some issue with the input.', App.Defaults.toastTime);
            }
        },

        // Doctor - Save
        'click .game-action-save': function(event, template) {
            event.preventDefault();

            console.log('E - click .game-action-save');

            var input = {};
            input.data = parseInt(template.$(event.currentTarget).attr('data'));
            input.gameId = Session.get('gameId');
            console.log(input);

            if(input.gameId != '') {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'before');

                Meteor.call('gameActionSave', input, function (error, response) {
                    console.log('M - gameActionSave');

                    if (error) {
                        App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                        Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                    } else {
                        Materialize.toast(response.message, App.Defaults.toastTime);
                    }
                });
            } else {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                Materialize.toast('Some issue with the input.', App.Defaults.toastTime);
            }
        },

        // Detective - Investigate
        'click .game-action-investigate': function(event, template) {
            event.preventDefault();

            console.log('E - click .game-action-investigate');

            var input = {};
            input.data = parseInt(template.$(event.currentTarget).attr('data'));
            input.gameId = Session.get('gameId');
            console.log(input);

            if(input.gameId != '') {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'before');

                Meteor.call('gameActionInvestigate', input, function (error, response) {
                    console.log('M - gameActionInvestigate');

                    if (error) {
                        App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                        Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                    } else {
                        Materialize.toast(response.message, App.Defaults.toastTime);
                    }
                });
            } else {
                App.Helpers.actionDisable(template.$(event.currentTarget), 'after');

                Materialize.toast('Some issue with the input.', App.Defaults.toastTime);
            }
        },

    'click .action-exit-app': function(event) {
        console.log('E - click .action-exit-app');

        event.preventDefault();

        Router.go('goodbye');
    }
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
        App.Materialize.Init.dropdown();
    });
};

// On Create
Template.gamePlay.onCreated(function () {
    console.log('R - Template.gamePlay.created');

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