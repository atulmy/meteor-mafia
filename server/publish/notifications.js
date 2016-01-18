// Publish Notifications collection to client

// Recent Notifications
Meteor.publish('notificationsRecent', function(gameId) {
    return Notifications.find({"gameId": gameId}, {sort: {createdAt: -1}, limit : 1});
});