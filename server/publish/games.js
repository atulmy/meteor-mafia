// Publish Games collection to client

// Recent Games
Meteor.publish('gamesRecent', function() {
    return Games.find({"isPublic": true}, {sort: {createdAt: -1}, limit : 5});
});

// List All Games
Meteor.publish('gamesList', function() {
    return Games.find({"isPublic": true}, {sort: {createdAt: -1}});
});

// My Games
Meteor.publish('gamesMy', function(userId) {
    return Games.find({"by.id": userId}, {sort: {createdAt: -1}});
});

// Single Games
Meteor.publish('game', function(gameId) {
    return Games.find(gameId);
});