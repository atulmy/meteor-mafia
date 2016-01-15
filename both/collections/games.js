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
                finished: false
            }
        };
        console.log(game);

        var gameId = Games.insert(game);
        if(gameId) {
            response.success = true;
            response.message = 'The game has been created. Good luck!';
            response.data = gameId;
        }

        return response;
    },

    gameJoin: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons">error_outline</i> There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.code, String);

        var game = Games.findOne({"city.code": input.code});
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
                        response.message = 'You have joined the game!';
                        response.data = game._id;
                    }
                } else {
                    response.success = true;
                    response.message = 'You have joined the game!';
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
            message: '<i class="material-icons">error_outline</i> There was some server error. Please try again',
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
    }

});