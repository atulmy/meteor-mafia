// Pages Home

// Helper
Template.pagesHome.helpers({

});

// Events
Template.pagesHome.events({
    'input #game_range': function(event, template) {
        template.$('#game_range_text').html(template.$(event.currentTarget).val())
    }
});

// On Render
Template.pagesHome.rendered = function () {
    $( function() {
        App.init();
        App.Materialize.Init.form();
    });
};