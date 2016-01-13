// Publish User to client

// Single User
Meteor.publish('userDetails', function() {
    if(this.userId) {
        return Meteor.users.find({_id: this.userId}, {fields: {'emails': 1, 'services': 1}});
    } else {
        this.ready();
    }
});