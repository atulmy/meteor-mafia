App.accessRule('*');

App.info({
    name: 'Mafia!',
    description: 'The Party Game',
    version: '1',
    author: 'Atul Yadav',
    email: 'atul.12788@gmail.com',
    website: 'http://app.mafia.atulmy.com'
});

App.icons({
    'android_ldpi': 'public/images/icons/mdpi/ic_launcher.png',
    'android_mdpi': 'public/images/icons/mdpi/ic_launcher.png',
    'android_hdpi': 'public/images/icons/hdpi/ic_launcher.png',
    'android_xhdpi': 'public/images/icons/xhdpi/ic_launcher.png'
});

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_ID: '880293582007783',
    API_KEY: 'fa564d233412ae91ebbb6bf351aef07e',
    APP_NAME: 'Mafia!'
});

App.setPreference('StatusBarOverlaysWebView', true);
App.setPreference('StatusBarStyle', 'default');
App.setPreference('SplashScreen', 'CDVSplashScreen');
App.setPreference('android-versionCode', '1');