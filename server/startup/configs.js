// Set up login services
Meteor.startup(function() {
    // Add Facebook configuration entry
    ServiceConfiguration.configurations.update(
        { service: "facebook" },
        {
            $set: {
                appId: "880293582007783",
                secret: "fa564d233412ae91ebbb6bf351aef07e"
            }
        },
        { upsert: true }
    );

    // Email
    process.env.MAIL_URL = "smtp://postmaster%40sandbox4be0c058856a433d85ae58d514816c57.mailgun.org:fa4df20667c9ad85aeb82572fc758903@smtp.mailgun.org:587";

    Cloudinary.config({
        cloud_name: 'atulmy',
        api_key: '929489619493485',
        api_secret: '5pm9VXZgqmPwjwQkV4uIQuNdaZQ'
    });
});