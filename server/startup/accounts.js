Accounts.onCreateUser(function(options, user) {
    console.log(user);
    if(user.services.facebook !== undefined) {
        options.profile.picture = {};
        options.profile.picture.id = '';
        options.profile.picture.url = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=400&height=400";
        options.profile.email = user.services.facebook.email;
    } else if (user.services.google !== undefined) {
        options.profile.picture = {};
        options.profile.picture.id = '';
        options.profile.picture.url = user.services.google.picture;
    } else if (user.services.twitter !== undefined) {
        options.profile.picture = {};
        options.profile.picture.id = '';
        options.profile.picture.url = user.services.twitter.picture;
    } else {
        options.profile = {};
        options.profile.name = "New Player";
        options.profile.email = user.emails[0].address;
        options.profile.picture = {};
        options.profile.picture.id = 'default-user-image';
        options.profile.picture.url = '/images/default-user-image.png';
    }
    user.profile = options.profile;
    return user;
});