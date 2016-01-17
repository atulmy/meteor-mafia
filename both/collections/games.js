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
            character: 0,
            ready: true
        };

        // create game document
        var game = {
            players: {
                expected: input.expected,
                joined: 1,
                list: [player]
            },
            city: {
                name: input.city,
                code: input.code
            },
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
                        character: 0,
                        ready: true
                    };
                    var players = game.players;
                    console.log(players);
                    players.joined++;
                    players.list.push(player);
                    var result = Games.update(game._id, {$set: {players: players}});
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

                    console.log(game.players.list);

                    var result = Games.update(game._id, {$set: {"is.started": input.value, "players.list": game.players.list}});
                    if (result) {
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

    gameUpdateIs: function(input) {
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
            var setData = {};
            if(input.key == 'started') {
                setData = {"is.started": input.value};
            } else if(input.key == 'finished') {
                setData = {"is.started": input.value};
            }
            var result = false; // Games.update(game._id, {$set: setData});
            if(result) {
                response.success = true;
                if(input.key == 'started') {
                    response.message = '<i class="material-icons left">notifications_active</i> The game has begin!';
                } else if(input.key == 'finished') {
                    response.message = '<i class="material-icons left">notifications_active</i> The game has finished!';
                }
            }
        }

        return response;
    }

});