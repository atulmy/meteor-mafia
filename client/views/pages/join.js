// Pages Join

// Helper
Template.pagesJoin.helpers({

});

// Events
Template.pagesJoin.events({
    'input #mafia-city-code': function(event, template) {
        event.preventDefault();

        console.log('E - input #mafia-city-code');

        if (template.$(event.currentTarget).val().length > 4) {
            template.$(event.currentTarget).val(template.$(event.currentTarget).val().slice(0, 4));
        }
    },

    'submit #form-game-join': function(event, template) {
        event.preventDefault();

        console.log('E - submit #game-join');

        // Show action loading
        App.Helpers.actionLoading('#form-game-join-submit', 'before');

        // Get Inputs
        var input = {};
        input.code = template.$('#mafia-city-code').val();
        console.log(input);

        // Validate
        if(input.code != '' && input.code.length === 4) {
            Meteor.call('gameJoin', input, function (error, response) {
                console.log('M - gameJoin');

                App.Helpers.actionLoading('#form-game-join-submit', 'after');

                if (error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    Materialize.toast(response.message, App.Defaults.toastTime);

                    if (response.success) {
                        // Game joined, redirect to game screen
                        Router.go('game', {gameId: response.data});
                    }
                }
            });
        } else {
            App.Helpers.actionLoading('#form-game-join-submit', 'after');

            Materialize.toast('The code must be 4 digits long.', App.Defaults.toastTime);
        }
    }
});

// On Render
Template.pagesJoin.rendered = function () {
    console.log('R - Template.pagesJoin.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};