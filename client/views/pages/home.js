// Pages Home

// Helper
Template.pagesHome.helpers({

});

// Events
Template.pagesHome.events({
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
        input.isMoneyGame = (parseInt(template.$('#game-money').find(':selected').val()) === 1) ? true : false;
        input.secretCityCode = App.Helpers.randomNumber(1000, 9999);
        console.log(input);

        // Validate
        if(input.gamePlayers != '' && input.gameMoney != '') {
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