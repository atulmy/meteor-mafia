Games = new Mongo.Collection('games');

// Functions for games collection
Meteor.methods({

    'gameCreate': function(input) {
        var response = {
            success: false,
            message: 'There was some error. Please try again.',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.players, Number);
        check(input.secretCityCode, Number);
        check(input.isMoneyGame, Boolean);

        // create game document
        var game = {
            players: input.players,
            by: {
                id: Meteor.userId(),
                name: Meteor.user().profile.name,
                image: Meteor.user().profile.picture
            },
            secretCityCode: input.secretCityCode,
            isMoneyGame: input.isMoneyGame,
            isPublic: false
        };
        console.log(game);

        var gameId = Games.insert(game);
        if(gameId) {
            response.success = true;
            response.message = 'Game has been created successfully.';
            response.data = gameId;
        }

        return response;
    }

});