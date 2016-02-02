// Pages Profile

// Helper
Template.userProfileDefault.helpers({

});

// Events
Template.userProfileDefault.events({
    'click #user-profile-image': function(event, template) {
        event.preventDefault();

        console.log('E - click #user-profile-image');

        // Show action loading
        App.Helpers.actionLoading('#user-profile-image', 'before');

        MeteorCamera.getPicture({quality: 50, width: 300, height: 300}, function(error, data) {
            if(typeof (data) != 'undefined') {
                Cloudinary._upload_file(data, {folder: 'user'}, function(error, response) {
                    console.log(error);
                    console.log(response);
                    if(!error) {
                        App.Helpers.actionLoading('#user-profile-image', 'after');
                        var imagePath = 'http://res.cloudinary.com/atulmy/image/upload/c_fill,h_200,w_200/v1/'+response.public_id; // @TODO use Cloudinary helper maybe

                        template.$('#user-profile-image-preview').attr('src', imagePath);
                        template.$('#user-profile-image-id').val(response.public_id);
                        template.$('#user-profile-image-url').val(imagePath);

                        Materialize.toast('Looking good!', App.Defaults.toastTime);
                    }
                });
            } else {
                App.Helpers.actionLoading('#user-profile-image', 'after');

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
        input.image = {};
        input.image.id = template.$('#user-profile-image-id').val();
        input.image.url = template.$('#user-profile-image-url').val();
        console.log(input);

        // Validate
        if(input.name != '' && input.name != 'New Player') {
            if(input.image.id != '' && input.image.id != 'default-user-image') {
                setTimeout(function() {
                    Meteor.call('userProfileUpdate', input, function (error, response) {
                        console.log('M - userProfileUpdate');

                        App.Helpers.actionLoading('#form-user-profile-submit', 'after');

                        if (error) {
                            Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                        } else {
                            Materialize.toast(response.message, App.Defaults.toastTime);

                            if (response.success) {
                                Router.go('home');
                            }
                        }
                    });
                }, 500);
            } else {
                Materialize.toast('And yes, click a nice photo of yours!', App.Defaults.toastTime);

                App.Helpers.actionLoading('#form-user-profile-submit', 'after');
            }
        } else {
            Materialize.toast('Enter your real name please!', App.Defaults.toastTime);

            App.Helpers.actionLoading('#form-user-profile-submit', 'after');
        }
    }
});

// On Render
Template.userProfileDefault.rendered = function() {
    console.log('R - Template.userProfile.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();

        $('#user-profile-name').on('focus', function() {
            $(this).select();
        });
    });
};