App.accessRule('*');

App.info({
    name: 'Footloose',
    description: 'Footloose!',
    version: '0.1',
    author: 'Atul Yadav',
    email: 'atul.12788@gmail.com',
    website: 'http://atulmy.com'
});

App.icons({
    'android_ldpi': 'public/images/icons/mdpi/ic_launcher.png',
    'android_mdpi': 'public/images/icons/mdpi/ic_launcher.png',
    'android_hdpi': 'public/images/icons/hdpi/ic_launcher.png',
    'android_xhdpi': 'public/images/icons/xhdpi/ic_launcher.png'
});

App.setPreference('SplashScreen', 'CDVSplashScreen');
App.setPreference('android-versionCode', '1');