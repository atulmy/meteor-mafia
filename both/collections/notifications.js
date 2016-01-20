Notifications = new Mongo.Collection('notifications');

// Functions for notifications collection
Meteor.methods({

    notificationCreate: function(input) {
        var response = {
            success: false,
            message: 'There was some server error. Please try again',
            data: ''
        };

        // check user signed in
        check(Meteor.userId(), String);

        // validate data
        check(input.gameId, Number);
        check(input.text, String);
        check(input.type, String);

        // create game document
        var notification = {
            gameId: input.gameId,
            text: input.text,
            type: input.type
        };
        console.log(notification);

        var notificationId = Notifications.insert(notification);
        if(notificationId) {
            response.success = true;
            response.message = 'Added';
            response.data = notificationId;
        }

        return response;
    }

});