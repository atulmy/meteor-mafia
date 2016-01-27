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

        var player = {
            id: Meteor.userId(),
            name: Meteor.user().profile.name,
            image: Meteor.user().profile.image.id,
            ready: true,
            character: 0,
            alive: true,
            settings: {
                sounds: true
            }
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
            rounds: [{
                votes: [{against: -1, self: 0, done: false}],
                votingEnabled: false,
                votingDone: false,
                doctor: {against: -1, done: false, saved: false},
                detective: {against: -1, done: false, guessed: false},
                mafia: {against: -1, done: false, killed: false}
            }],
            activities: [{text: 'Game created', when: new Date()}],
            discussions: {
                user: [{name: '^_^', message: 'Lets catch the mafia, shall we?'}],
                mafia: [{name: '^_^', message: 'You must be feeling lucky, don\'t you?'}]
            },
            notify: {round: false, killed: false, discussion: false},
            settings: {
                paused: false,
                sounds: true
            },
            is: {
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
                        image: Meteor.user().profile.image.id,
                        ready: true,
                        character: 0,
                        alive: true,
                        settings: {
                            sounds: true
                        }
                    };
                    var players = game.players;
                    console.log(players);
                    players.joined++;
                    players.list.push(player);

                    var rounds = game.rounds;
                    rounds[rounds.length - 1].votes.push({against: -1, self: 0, done: false});

                    var text = Meteor.user().profile.name+' has joined the game!';

                    // Activities
                    var activities = game.activities;
                    activities.push({text: text, when: new Date()});

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

                if(game.players.list.length >= 4) {
                    // Calculate number of mafias
                    var mafias = 1;
                    if(game.players.joined <= 6) {
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
                    activities.push({text: text, when: new Date()});
                    activities.push({text: 'Round 1 - Begins', when: new Date()});

                    var result = Games.update(game._id, {$set: {
                        "is.started": input.value,
                        "players.list": game.players.list,
                        activities: activities
                    }});
                    if (result) {
                        // Notifications
                        Meteor.setTimeout(function() {
                            Notifications.insert({gameId: game._id, type: 'overlay', text: 'Game Started <br/> Round 1'});
                        }, 3000);

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

    gameSettingsPause: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, String);
        check(input.pause, Boolean);

        var game = Games.findOne(input.gameId);
        if(game) {
            var result = Games.update(game._id, {$set: {
                "settings.paused": input.pause
            }});
            if(result) {
                response.success = true;
                if(input.pause) {
                    response.message = '<i class="material-icons left">pause_circle_filled</i> Game has been paused.';
                } else {
                    response.message = '<i class="material-icons left">play_circle_filled</i> Game is now resumed.';
                }
            }
        }

        return response;
    },

    gameSettingsSoundToggle: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.data, Number);
        check(input.gameId, String);

        var game = Games.findOne(input.gameId);
        if(game) {
            var sound = (game.players.list[input.data].settings.sounds) ? false : true;
            var result = Games.update(
                {_id: game._id, "players.list.id": Meteor.userId()},
                {
                    "$set": {
                        'players.list.$.settings.sounds': sound
                    }
                }
            );
            if(result) {
                response.success = true;
                if(sound) {
                    response.message = '<i class="material-icons left">volume_up</i> Sounds are now ON.';
                } else {
                    response.message = '<i class="material-icons left">volume_off</i> Sounds are now OFF.';
                }
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

    // Game Actions

        // Mafia - Kill
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
                    Meteor.call('gameRoundPreVoting', input, function (error, response) {
                        console.log('M - gameRoundPreVoting');
                    });

                    response.success = true;
                    response.message = '<i class="material-icons left">check</i> '+save.name+' will be killed if the doctor is unable to save.';
                }
            }

            return response;
        },

        // Doctor -Save
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
                    Meteor.call('gameRoundPreVoting', input, function (error, response) {
                        console.log('M - gameRoundPreVoting');
                    });

                    response.success = true;
                    response.message = '<i class="material-icons left">check</i> '+save.name+' will be safe for this round.';
                }
            }

            return response;
        },

        // Detective - Investigate
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
                    Meteor.call('gameRoundPreVoting', input, function (error, response) {
                        console.log('M - gameRoundPreVoting');
                    });

                    response.success = true;
                    response.message = message;
                }
            }

            return response;
        },

        gameRoundPreVoting: function(input) {
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
                var players = game.players;
                var rounds = game.rounds;
                var round = game.rounds[game.rounds.length - 1];

                var mafiaIsAlive = true;
                var doctorIsAlive = true;
                var detectiveIsAlive = true;
                game.players.list.forEach(function(p) {
                    if(p.character == 1) {
                        mafiaIsAlive = p.alive;
                    } else if(p.character == 2) {
                        doctorIsAlive = p.alive;
                    } else if(p.character == 3) {
                        detectiveIsAlive = p.alive;
                    }
                });
                if( // either ((the player should be alive and has taken action) || player is dead) then its fine
                    ((mafiaIsAlive && round.mafia.done == true) || !mafiaIsAlive) &&
                    ((doctorIsAlive && round.doctor.done == true) || !doctorIsAlive) &&
                    ((detectiveIsAlive && round.detective.done == true) || !detectiveIsAlive)
                ) {
                    var killPlayer = round.mafia.against;
                    if(round.doctor.against == killPlayer) {
                        // Player saved
                        round.mafia.killed = false;
                        round.doctor.saved = true;

                        var text = 'Mafia\s target has been saved!';

                        // Activities
                        var activities = game.activities;
                        activities.push({text: text, when: new Date()});

                        // Notifications
                        Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                    } else {
                        // Player is dead
                        round.mafia.killed = true;
                        round.doctor.saved = false;

                        players.list[killPlayer].alive = false;

                        var text = players.list[killPlayer].name+' is dead!';

                        // Activities
                        var activities = game.activities;
                        activities.push({text: text, when: new Date()});

                        // Notifications
                        Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                    }

                    var result = Games.update(game._id, {$set: {
                        players: players,
                        rounds: rounds,
                        activities: activities
                    }});
                    if (result) {
                        Meteor.call('gameEnableVoting', input, function (error, response) {
                            console.log('M - gameEnableVoting');
                        });

                            response.success = true;
                        response.message = 'Done';
                    }
                }
            }

            return response;
        },

        // Enable Voting
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
                var players = game.players;
                var rounds = game.rounds;
                var round = game.rounds[game.rounds.length - 1];

                // Check how many players alive
                var totalAlive = 0;
                players.list.forEach(function(p){
                    if(p.alive) {
                        totalAlive++;
                    }
                });

                if(totalAlive <= 2) {
                    // The game ends, not enough citizen alive to

                    // Kill remaining player
                    var playerMafia = -1;
                    players.list.forEach(function(p, index) {
                        if(p.character == 1) {
                            playerMafia = index;
                        }
                    });

                    players.list.forEach(function(p, index){
                        if(index != playerMafia) {
                            players.list[index].alive = false;
                        }
                    });

                    var is = game.is;
                    is.finished = true;

                    // Activities
                    var text = 'Round ' + (rounds.length) + ' - Ends';
                    var activities = game.activities;
                    activities.push({text: text, when: new Date()});
                    text = 'Game finished! Mafia Won';
                    activities.push({text: text, when: new Date()});

                    var result = Games.update(game._id, {$set: {
                        players: players,
                        activities: activities,
                        is: is
                    }});

                    if (result) {
                        // Notifications
                        Meteor.setTimeout(function() {
                            // Notifications
                            Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                        }, 5000);

                        response.success = true;
                        response.message = 'Done';
                    }
                } else {
                    round.votingEnabled = true;

                    var text = 'Vote for the mafia!';

                    // Activities
                    var activities = game.activities;
                    activities.push({text: text, when: new Date()});

                    Meteor.setTimeout(function() {
                        // Notifications
                        Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                    }, 5000);

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
        },

        // Vote
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

            console.log(input);

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
                activities.push({text: text, when: new Date()});

                // Notifications
                Notifications.insert({gameId: game._id, type: 'toast', text: '<i class="material-icons left">exposure_plus_1</i> '+text, by: Meteor.userId()});

                var result = Games.update(game._id, {$set: {
                    rounds: rounds,
                    activities: activities
                }});
                if (result) {
                    Meteor.call('gameVotingDone', input);

                    response.success = true;
                    response.message = '<i class="material-icons left">check</i> Voted!';
                }
            }

            return response;
        },

        // Voting Done
        gameVotingDone: function(input) {
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
                var votingDone = true;
                var rounds = game.rounds;
                var round = rounds[rounds.length - 1];

                round.votes.forEach(function (v, index) {
                    console.log(index);
                    if (!v.done && game.players.list[index].alive) {
                        votingDone = false;
                    }
                });

                if (votingDone) {
                    // Check for a tie
                    var tie = false;
                    var highestVoteAgainst = {player: -1, votes: 0};
                    round.votes.forEach(function (v, index) {
                        if (v.self > 0 && v.self > highestVoteAgainst.votes) {
                            highestVoteAgainst.player = index;
                            highestVoteAgainst.votes = v.self;
                        } else if (v.self > 0 && v.self == highestVoteAgainst.votes) {
                            tie = true;
                        }
                    });

                    if (tie) {
                        var voteEmpty = {against: -1, self: 0, done: false};
                        round.votes.forEach(function (v, index) {
                            round.votes[index] = voteEmpty;
                        });
                        rounds[rounds.length - 1] = round;

                        var text = 'Its a tie! Re-vote';

                        // Activities
                        var activities = game.activities;
                        activities.push({text: text, when: new Date()});

                        // Notifications
                        Notifications.insert({gameId: game._id, type: 'overlay', text: text});

                        var result = Games.update(game._id, {
                            $set: {
                                rounds: rounds,
                                activities: activities
                            }
                        });
                    } else {
                        round.votingDone = true;

                        var text = 'Voting finished!';

                        // Activities
                        var activities = game.activities;
                        activities.push({text: text, when: new Date()});

                        // Notifications
                        Notifications.insert({gameId: game._id, type: 'overlay', text: text});

                        var result = Games.update(game._id, {
                            $set: {
                                rounds: rounds,
                                activities: activities
                            }
                        });
                        if (result) {
                            Meteor.call('gameRoundPostVoting', input);

                            response.success = true;
                            response.message = 'Done';
                        }
                    }
                }
            }

            return response;
        },

        // Post Voting
        gameRoundPostVoting: function(input) {
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
                var players = game.players;
                var rounds = game.rounds;
                var round = game.rounds[game.rounds.length - 1];

                // 1. Check votes and decide if mafia is caught
                var highestVoteAgainst = {player: -1, votes: 0};
                round.votes.forEach(function(v, index) {
                    if(v.self > highestVoteAgainst.votes) {
                        highestVoteAgainst.player = index;
                        highestVoteAgainst.votes = v.self;
                    }
                });

                var playerMafia = -1;
                players.list.forEach(function(p, index) {
                    if(p.character == 1) {
                        playerMafia = index;
                    }
                });

                var mafiaIsAlive = true;
                if(playerMafia == highestVoteAgainst.player) {
                    // Mafia is caught
                    mafiaIsAlive = false;
                }

                if(!mafiaIsAlive) {
                    // 2. Mafia is caught game finishes and citizens wins
                    players.list[highestVoteAgainst.player].alive = false;
                    var is = game.is;
                    is.finished = true;

                    // Activities
                    var text = 'Round ' + (rounds.length) + ' - Ends';
                    var activities = game.activities;
                    activities.push({text: text, when: new Date()});
                    text = 'Game finished! Citizens Won';
                    activities.push({text: text, when: new Date()});

                    var result = Games.update(game._id, {$set: {
                        players: players,
                        activities: activities,
                        is: is
                    }});

                    if (result) {
                        // Notifications
                        Meteor.setTimeout(function() {
                            // Notifications
                            Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                        }, 5000);

                        response.success = true;
                        response.message = 'Done';
                    }
                } else {
                    // 3. Mafia not caught, the voted citizen dies, game continues with new round
                    players.list[highestVoteAgainst.player].alive = false;

                    // Check how many players alive
                    var totalAlive = 0;
                    players.list.forEach(function(p){
                        if(p.alive) {
                            totalAlive++;
                        }
                    });

                    if(totalAlive <= 2) {
                        // The game ends, not enough citizen alive to

                        // Kill remaining player
                        players.list.forEach(function(p, index){
                            if(index != playerMafia) {
                                players.list[index].alive = false;
                            }
                        });

                        var is = game.is;
                        is.finished = true;

                        // Activities
                        var text = 'Round ' + (rounds.length) + ' - Ends';
                        var activities = game.activities;
                        activities.push({text: text, when: new Date()});
                        text = 'Game finished! Mafia Won';
                        activities.push({text: text, when: new Date()});

                        var result = Games.update(game._id, {$set: {
                            players: players,
                            activities: activities,
                            is: is
                        }});

                        if (result) {
                            // Notifications
                            Meteor.setTimeout(function() {
                                // Notifications
                                Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                            }, 5000);

                            response.success = true;
                            response.message = 'Done';
                        }
                    } else {
                        // The game continues
                        var round = {
                            votes: new Array(game.players.joined).fill({against: -1, self: 0, done: false}),
                            votingEnabled: false,
                            votingDone: false,
                            doctor: {against: -1, done: false, saved: false},
                            detective: {against: -1, done: false, guessed: false},
                            mafia: {against: -1, done: false, killed: false}
                        };
                        rounds.push(round);

                        // Activities
                        var activities = game.activities;
                        var textVoteOut = players.list[highestVoteAgainst.player].name + ' was voted out';
                        activities.push({text: textVoteOut, when: new Date()});

                        // Notifications
                        Meteor.setTimeout(function () {
                            // Notifications
                            Notifications.insert({gameId: game._id, type: 'overlay', text: textVoteOut});
                        }, 5000);

                        text = 'Round ' + (rounds.length - 1) + ' - Ends';
                        activities.push({text: text, when: new Date()});
                        text = 'Round ' + rounds.length + ' - Begins';
                        activities.push({text: text, when: new Date()});

                        var result = Games.update(game._id, {$set: {
                            players: players,
                            rounds: rounds,
                            activities: activities
                        }});

                        if (result) {
                            // Notifications
                            Meteor.setTimeout(function () {
                                // Notifications
                                Notifications.insert({gameId: game._id, type: 'overlay', text: text});
                            }, 10000);

                            response.success = true;
                            response.message = 'Done';
                        }
                    }
                }
            }

            return response;
        }
});