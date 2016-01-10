// Common Header

// Helper
Template.commonHeader.helpers({

});

// Events
Template.commonHeader.events({
    'click .header-actions': function(event, template) {
        console.log('E - click .header-actions');

        // Check for Form
        var formAction = template.$(event.currentTarget).attr('data-action-form');
        if(formAction) {
            $(formAction).submit();
        }

        event.preventDefault();
    }
});

// On Render
Template.commonHeader.rendered = function() {
    $( function() {

    });
};