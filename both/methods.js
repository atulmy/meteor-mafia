// common functions
Meteor.methods({

    // User
    'userProfileUpdate': function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some error. Please try again.',
            data: ''
        };

        var profile = Meteor.user().profile;

        // Name
        if(typeof input.name != 'undefined') {
            profile.name = input.name;
        }
        // Image
        if(typeof input.image.id != 'undefined') {
            profile.image.id = input.image.id;
            profile.image.url = input.image.url;
        }

        var check = Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
        if(check) {
            response.success = true;
            response.message = '<i class="material-icons left">check_circle</i> Your profile has been updated successfully.';
        }

        return response;
    },

    emailContact: function(input) {
        var response = {
            success: false,
            message: '<i class="material-icons left">error_outline</i> There was some error. Please try again.',
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
            response.message = '<i class="material-icons left">email</i> Thank you for contacting us. We will get back to soon as we can.';
        }

        return response;
    }

});