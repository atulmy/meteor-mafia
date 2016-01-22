// Pages Profile

// Helper
Template.userProfileEdit.helpers({

});

// Events
Template.userProfileEdit.events({
    'click #user-profile-image': function(event, template) {
        event.preventDefault();

        console.log('E - click #user-profile-image');

        MeteorCamera.getPicture({quality: 50, width: 300, height: 300}, function(error, data) {
            if(typeof (data) != 'undefined') {
                template.$('#user-profile-picture').val(data);
                template.$('#user-profile-picture-preview').attr('src', data);

                Materialize.toast('Looking good!', App.Defaults.toastTime);
            } else {
                Materialize.toast('Please allow the camera permission.', App.Defaults.toastTime);
            }
        });
    },

    'submit #form-user-profile': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-user-profile');

        // Show action loading
        App.Helpers.actionLoading('#form-user-profile-submit', 'before');

        // Get Inputs
        var input = {};
        input.name = template.$('#user-profile-name').val();
        input.picture = template.$('#user-profile-picture').val();
        console.log(input);

        // Validate
        if(input.name != '') {
            setTimeout(function() {
                Meteor.call('userProfileUpdate', input, function (error, response) {
                    console.log('M - userProfileUpdate');

                    App.Helpers.actionLoading('#form-user-profile-submit', 'after');

                    if (error) {
                        Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                    } else {
                        Materialize.toast(response.message, App.Defaults.toastTime);

                        if (response.success) {
                            Router.go('profile');
                        }
                    }
                });
            }, 500);
        } else {
            Materialize.toast('Please provide all the required data.', App.Defaults.toastTime);

            App.Helpers.actionLoading('#form-user-profile-submit', 'after');
        }
    }
});

// On Render
Template.userProfileEdit.rendered = function() {
    console.log('R - Template.userProfileEdit.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};