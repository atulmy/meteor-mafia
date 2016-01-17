// Publish Games collection to client

// Recent Games
Meteor.publish('gamesRecent', function() {
    return Games.find({"is.finished": false, "is.started": false}, {sort: {createdAt: -1}, limit : 5});
});

// List All Games
Meteor.publish('gamesList', function() {
    return Games.find({}, {sort: {createdAt: -1}});
});

// My Games
Meteor.publish('gamesMy', function(userId) {
    return Games.find({"players.0.id": userId}, {sort: {createdAt: -1}});
});

// Single Game
Meteor.publish('game', function(gameId) {
    return Games.find(gameId);
});