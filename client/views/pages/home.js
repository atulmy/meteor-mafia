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

    'input #game-players': function(event, template) {
        event.preventDefault();

        console.log('E - input #game-players');

        template.$('#game-players-text').html(template.$(event.currentTarget).val())
    },

    'submit #form-create-game': function(event, template) {
        event.preventDefault();

        console.log('E - submit #form-create-game');

        // Show action loading
        App.Helpers.actionLoading('#form-create-game-submit', 'before');

        // Get Inputs
        var input = {};
        input.players = parseInt(template.$('#game-players').val());
        input.city = template.$('#game-city').val();
        if(input.city == 'Random') {
            input.city = App.Defaults.cities[App.Helpers.randomNumber(0, (App.Defaults.cities.length - 1))];
        }
        input.code = App.Helpers.randomNumber(1000, 9999);
        input.isMoneyGame = (parseInt(template.$('#game-money').find(':selected').val()) === 1) ? true : false;
        console.log(input);

        // Validate
        if(input.gamePlayers != '' && input.city != '' && input.code != '' && input.gameMoney != '') {
            Meteor.call('gameCreate', input, function (error, response) {
                console.log('M - gameCreate');

                App.Helpers.actionLoading('#form-create-game-submit', 'after');

                if (error) {
                    Materialize.toast('There was some error', 4000);
                } else {
                    Materialize.toast(response.message, 4000);

                    if (response.success) {
                        // Game created, redirect to play screen
                        Router.go('play', {gameId: response.data});
                    }
                }
            });
        } else {
            Materialize.toast('Please provide all the required data.', 4000);

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