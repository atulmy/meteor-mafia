Meteor.startup(function() {

    if(Meteor.isCordova) {
        console.log('User - Mobile');

        window.plugins.uniqueDeviceID.get(function(uuid) {
            App.User.loginOrCreate(uuid);
        });
    } else {
        console.log('User - Desktop');

        var uuid = Session.get('uuid');
        if(!uuid) {
            uuid = App.Helpers.uuid();
            Session.setPersistent('uuid', uuid);
        }

        App.User.loginOrCreate(uuid);
    }

});