// Pages Home

// Helper
Template.pagesHome.helpers({
    'cities': function() {
        return App.Defaults.cities;
    }
});

// Events
Template.pagesHome.events({
    'click #game-city': function(event, template) {
        event.preventDefault();

        console.log('E - click #game-city');

        $('#modal-game-city-selection').openModal();
    },

    'input #game-expected': function(event, template) {
        event.preventDefault();

        console.log('E - input #game-expected');

        template.$('#game-expected-text').html(template.$(event.currentTarget).val());
    },

    'submit #form-create-game': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-create-game');

        // Show action loading
        App.Helpers.actionLoading('#form-create-game-submit', 'before');

        // Get Inputs
        var input = {};
        input.expected = parseInt(template.$('#game-expected').val());
        input.city = template.$('#game-city').find(':selected').val();
        if(input.city == 'Random') {
            input.city = App.Defaults.cities[App.Helpers.randomNumber(0, (App.Defaults.cities.length - 1))];
        }
        input.code = App.Helpers.randomNumber(1000, 9999);
        console.log(input);

        // Validate
        if(input.gamePlayers != '' && input.city != '' && input.code != '') {
            Meteor.call('gameCreate', input, function (error, response) {
                console.log('M - gameCreate');

                App.Helpers.actionLoading('#form-create-game-submit', 'after');

                if (error) {
                    Materialize.toast(App.Defaults.messages.error, App.Defaults.toastTime);
                } else {
                    Materialize.toast(response.message, App.Defaults.toastTime);

                    if (response.success) {
                        // Game created, redirect to play screen
                        Router.go('game', {gameId: response.data});
                    }
                }
            });
        } else {
            Materialize.toast('Please provide all the required data.', App.Defaults.toastTime);

            App.Helpers.actionLoading('#form-create-game-submit', 'after');
        }
    }
});

// On Render
Template.pagesHome.rendered = function () {
    console.log('R - Template.pagesHome.rendered');

    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};