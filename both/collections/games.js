Games = new Mongo.Collection('games');

// Functions for games collection
Meteor.methods({

    gameCreate: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.expected, Number);
        check(input.city, String);
        check(input.code, Number);
        check(input.isMoneyGame, Boolean);

        var player = {
            id: Meteor.userId(),
            name: Meteor.user().profile.name,
            image: Meteor.user().profile.picture,
            ready: true,
            character: 0,
            alive: true
        };

        // create game document
        var game = {
            city: {
                name: input.city,
                code: input.code
            },
            players: {
                expected: input.expected,
                joined: 1,
                list: [player]
            },
            rounds: [
                {
                    votes: [{against: -1, done: false}],
                    votesEnabled: false,
                    doctor: {against: -1, done: false, saved: false},
                    detective: {against: -1, done: false, guessed: false},
                    mafia: {against: -1, done: false, killed: false}
                }
            ],
            activities: [{text: 'Game created'}],
            discussions: {
                user: [{name: '^_^', message: 'Lets catch the mafia, shall we?'}],
                mafia: [{name: '^_^', message: 'You must be feeling lucky, don\'t you?'}]
            },
            notify: {round: false, killed: false, discussion: false},
            is: {
                moneyGame: input.isMoneyGame,
                publicGame: false,
                started: false,
                finished: false
            }
        };
        console.log(game);

        var gameId = Games.insert(game);
        if(gameId) {
            response.success = true;
            response.message = '<i class="material-icons left">notifications_active</i> The game has been created!';
            response.data = gameId;
        }

        return response;
    },

    gameJoin: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.code, String);

        var game = Games.findOne({"city.code": input.code, "is.finished": false, "is.started": false});
        console.log(game);
        if(typeof game != 'undefined' && game._id) {

            // Game is full ?
            if(game.players.joined == game.players.expected) {
                response.message = 'Umm, the game is already full! You are late.';
            } else {

                // Player already joined ?
                var playerExists = false;
                game.players.list.forEach(function (v) {
                    if (v.id == Meteor.userId()) {
                        playerExists = true;
                    }
                });

                if (!playerExists) {
                    var player = {
                        id: Meteor.userId(),
                        name: Meteor.user().profile.name,
                        image: Meteor.user().profile.picture,
                        ready: true,
                        character: 0,
                        alive: true
                    };
                    var players = game.players;
                    console.log(players);
                    players.joined++;
                    players.list.push(player);

                    var rounds = game.rounds;
                    rounds[rounds.length - 1].votes.push({against: -1, done: false});

                    var text = Meteor.user().profile.name+' has joined the game!';

                    // Activities
                    var activities = game.activities;
                    activities.push({text: text});

                    // Notifications
                    Notifications.insert({gameId: game._id, type: 'toast', text: '<i class="material-icons left">person_add</i> '+text, by: Meteor.userId()});

                    // Update game
                    var result = Games.update(game._id, {$set: {
                        players: players,
                        activities: activities,
                        rounds: rounds
                    }});
                    if (result) {
                        response.success = true;
                        response.message = '<i class="material-icons left">person_add</i> You have joined the game!';
                        response.data = game._id;
                    }
                } else {
                    response.success = true;
                    response.message = '<i class="material-icons left">person_add</i> You have joined the game!';
                    response.data = game._id;
                }
            }
        } else {
            response.message = 'Umm, no game exists with that code.';
        }

        return response;
    },

    gameToggleReady: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.ready, Boolean);

        var game = Games.findOne(input.gameId);
        if(game) {
            var result = Games.update(
                {_id: game._id, "players.list.id": Meteor.userId()},
                {
                    "$set": {
                        'players.list.$.ready': input.ready
                    }
                }
            );
            if(result) {
                response.success = true;
                if(input.ready) {
                    response.message = '<i class="material-icons left">done</i> You are ready to play.';
                } else {
                    response.message = '<i class="material-icons left">timer</i> You are not ready to play.';
                }
            }
        }

        return response;
    },

    gameStart: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.key, String);
        check(input.value, Boolean);


        var game = Games.findOne(input.gameId);
        if(game) {
            if(!game.is.started) {
                console.log(game);

                if(game.players.list.length >= 6) {
                    // Calculate number of mafias
                    var mafias = 1;
                    if(game.players.joined == 6) {
                        mafias = 1;
                    } else if(game.players.joined > 6 && game.players.joined <= 10) {
                        mafias = 2;
                    } else if(game.players.joined > 10 && game.players.joined <= 16) {
                        mafias = 3;
                    } else if(game.players.joined > 16) {
                        mafias = 4;
                    }
                    mafias = 1; // @TEMP

                    console.log(mafias);

                    // Assign each player a character
                    var characters = new Array(mafias).fill(1); // mafias
                    characters.push(2);
                    characters.push(3);
                    for(var i=0; i < (game.players.joined - (mafias + 2)); i++) {
                        characters.push(0);
                    }
                    console.log(characters);
                    characters = _.shuffle(_.shuffle(characters));
                    console.log(characters);
                    for(var j = 0; j < game.players.list.length; j++) {
                        game.players.list[j].character = characters[j];
                    }

                    var text = 'The game has started!';

                    // Activities
                    var activities = game.activities;
                    activities.push({text: text});

                    // Notifications
                    Notifications.insert({gameId: game._id, type: 'toast', text: '<i class="material-icons left">play_arrow</i> '+text, by: Meteor.userId()});

                    var result = Games.update(game._id, {$set: {
                        "is.started": input.value,
                        "players.list": game.players.list,
                        activities: activities
                    }});
                    if (result) {
                        // Notifications - Round 1
                        Meteor.setTimeout(function() {
                            Notifications.insert({gameId: game._id, type: 'overlay', text: 'Round 1'});
                        }, 2000);

                        response.success = true;
                        response.message = '<i class="material-icons left">notifications_active</i> The game has begin!';
                    }
                }
            } else {
                response.success = true;
                response.message = '<i class="material-icons left">notifications_active</i> The game has begin!';
            }
        }

        return response;
    },

    gameDiscussion: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.message, String);
        check(input.type, String);

        var game = Games.findOne(input.gameId);
        if(game) {
            var discussions = '';
            var result = false;
            if(input.type == 'mafia') {
                discussions = game.discussions.mafia;
                discussions.push({name: Meteor.user().profile.name, message: input.message});
                result = Games.update(game._id, {$set: {"discussions.mafia": discussions}});
            } else {
                discussions = game.discussions.user;
                discussions.push({name: Meteor.user().profile.name, message: input.message});
                result = Games.update(game._id, {$set: {"discussions.user": discussions}});
            }

            if(result) {
                response.success = true;
                response.message = 'Sent!';
            }
        }

        return response;
    },

    gameActionVote: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        console.log(input);

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.data, Number);
        check(input.dataPlayerKey, Number);

        var game = Games.findOne(input.gameId);
        if(game) {
            var voteAgainst = game.players.list[input.data];
            var rounds = game.rounds;
            var round = game.rounds[game.rounds.length - 1];

            round.votes[input.dataPlayerKey].against = input.data;
            round.votes[input.dataPlayerKey].done = true;
            round.votes[input.data].self++;

            var text = Meteor.user().profile.name+' voted against '+voteAgainst.name;

            // Activities
            var activities = game.activities;
            activities.push({text: text});

            // Notifications
            Notifications.insert({gameId: game._id, type: 'toast', text: '<i class="material-icons left">exposure_plus_1</i> '+text, by: Meteor.userId()});

            var result = Games.update(game._id, {$set: {
                rounds: rounds,
                activities: activities
            }});
            if (result) {
                response.success = true;
                response.message = '<i class="material-icons left">check</i> Voted!';
            }
        }

        return response;
    },

    gameActionInvestigate: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.data, Number);


        var game = Games.findOne(input.gameId);
        if(game) {
            var message = '';
            var investigateOn = game.players.list[input.data];
            var rounds = game.rounds;
            var round = game.rounds[game.rounds.length - 1];

            round.detective.against = input.data;
            round.detective.done = true;

            if(investigateOn.character == 1) {
                message = '<i class="material-icons left">check</i> Yes, '+investigateOn.name+' is a mafia.';
                round.detective.guessed = true;
            } else {
                message = '<i class="material-icons left">close</i> No, '+investigateOn.name+' is not a mafia.';
                round.detective.guessed = false;
            }
            rounds[game.rounds.length - 1] = round;
            console.log(game);

            var result = Games.update(game._id, {$set: {
                rounds: rounds
            }});
            if (result) {
                Meteor.call('gameEnableVoting', input);

                response.success = true;
                response.message = message;
            }
        }

        return response;
    },

    gameActionSave: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.data, Number);


        var game = Games.findOne(input.gameId);
        if(game) {
            var save = game.players.list[input.data];
            var rounds = game.rounds;
            var round = game.rounds[game.rounds.length - 1];

            round.doctor.against = input.data;
            round.doctor.done = true;
            round.doctor.saved = false; // not yet known

            rounds[game.rounds.length - 1] = round;
            console.log(game);

            var result = Games.update(game._id, {$set: {
                rounds: rounds
            }});
            if (result) {
                Meteor.call('gameEnableVoting', input);

                response.success = true;
                response.message = '<i class="material-icons left">check</i> '+save.name+' will be safe for this round.';
            }
        }

        return response;
    },

    gameActionKill: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.data, Number);


        var game = Games.findOne(input.gameId);
        if(game) {
            var save = game.players.list[input.data];
            var rounds = game.rounds;
            var round = game.rounds[game.rounds.length - 1];

            round.mafia.against = input.data;
            round.mafia.done = true;
            round.mafia.killed = false; // not yet known

            rounds[game.rounds.length - 1] = round;
            console.log(game);

            var result = Games.update(game._id, {$set: {
                rounds: rounds
            }});
            if (result) {
                Meteor.call('gameEnableVoting', input);

                response.success = true;
                response.message = '<i class="material-icons left">check</i> '+save.name+' will be killed if the doctor is unable to save.';
            }
        }

        return response;
    },

    // Private Function
    gameEnableVoting: function(input) {
        var response = {
            success: false,
            message: 'Error',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);


        var game = Games.findOne(input.gameId);
        if(game) {
            var rounds = game.rounds;
            var round = game.rounds[game.rounds.length - 1];

            if(round.mafia.done == true && round.doctor.done == true && round.detective.done == true) {
                round.votesEnabled = true;

                var text = 'Vote for the mafia!';

                // Activities
                var activities = game.activities;
                activities.push({text: text});

                // Notifications
                Notifications.insert({gameId: game._id, type: 'toast', text: '<i class="material-icons left">notifications_active</i> '+text, by: Meteor.userId()});

                var result = Games.update(game._id, {$set: {
                    rounds: rounds,
                    activities: activities
                }});
                if (result) {
                    response.success = true;
                    response.message = 'Done';
                }
            }
        }

        return response;
    }
});