// Publish Notifications collection to client

// Game Notifications
Meteor.publish('notificationsGame', function(gameId) {
    return Notifications.find({gameId: gameId}, {sort: {createdAt: -1}, limit : 1});
});