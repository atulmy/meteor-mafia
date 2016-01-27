Meteor.methods({

    userCreate: function(uuid) {
        console.log("User doesn't exist. Creating.");

        Accounts.createUser({
            username: uuid,
            password: uuid,
            profile: {
                name: 'New Player',
                image: {
                    id: 'default-user-image',
                    url: 'http://res.cloudinary.com/atulmy/image/upload/v1453840187/default-user-image.png'
                }
            }
        });
        return;
    }

});