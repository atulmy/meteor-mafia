// common functions
Meteor.methods({

    // User
    'userProfileUpdate': function(input) {
        var response = {
            success: false,
            message: 'There was some error. Please try again.',
            data: ''
        };

        var profile = Meteor.user().profile;

        // Name
        if(typeof input.name != 'undefined') {
            profile.name = input.name;
        }
        // Picture
        if(typeof input.picture != 'undefined') {
            profile.picture = input.picture;
        }

        var check = Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
        if(check) {
            response.success = true;
            response.message = 'Your profile has been updated successfully.';
        }

        return response;
    },

    emailContact: function(input) {
        var response = {
            success: false,
            message: 'There was some error. Please try again.',
            data: ''
        };

        if(Meteor.isServer) {
            SSR.compileTemplate('emailContact', Assets.getText('views/emails/contact.html'));

            var emailResponse = Email.send({
                to: "atul.12788@gmail.com",
                from: input.email,
                subject: "Contact - Mafia! App",
                html: SSR.render('emailContact', input)
            });
            console.log(emailResponse);

            response.success = true;
            response.message = 'Thank you for contacting us. We will get back to soon as we can.';
        }

        return response;
    }

});