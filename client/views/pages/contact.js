// Pages Join

// Helper
Template.pagesContact.helpers({
    'userEmail': function() {
        var user = Meteor.user();
        console.log(user);
        if (user && user.emails) {
            return user.emails[0].address;
        }
    }
});

// Events
Template.pagesContact.events({
    'submit #form-contact': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-contact');

        // Show action loading
        App.Helpers.actionLoading('#form-contact-submit', 'before');

        // Get Inputs
        var input = {};
        input.name = template.$('#contact-name').val();
        input.email = template.$('#contact-email').val();
        input.message = template.$('#contact-message').val();
        console.log(input);

        // Validate
        if(input.name != '' && input.email != '') {
            Meteor.call('emailContact', input, function (error, response) {
                console.log('M - emailContact');

                App.Helpers.actionLoading('#form-contact-submit', 'after');

                if (error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    Materialize.toast(response.message, App.Defaults.toastTime);

                    if (response.success) {
                        template.$('#contact-name').val('');
                        template.$('#contact-email').val('');
                        template.$('#contact-message').val('');
                    }
                }
            });
        } else {
            App.Helpers.actionLoading('#form-contact-submit', 'after');

            Materialize.toast('Please provide all the required inputs.', App.Defaults.toastTime);
        }
    }
});

// On Render
Template.pagesContact.rendered = function () {
    console.log('R - Template.pagesContact.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};