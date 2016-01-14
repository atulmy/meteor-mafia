Accounts.onCreateUser(function(options, user) {
    console.log(user);
    if(user.services.facebook !== undefined) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=400&height=400";
        options.profile.email = user.services.facebook.email;
    } else if (user.services.google !== undefined) {
        options.profile.picture = user.services.google.picture;
    } else if (user.services.twitter !== undefined) {
        options.profile.picture = user.services.twitter.picture;
    } else {
        options.profile = {};
        options.profile.name = "New Player";
        options.profile.picture = '/images/default-user-image.png';
        options.profile.email = user.emails[0].address;
    }
    user.profile = options.profile;
    return user;
});