// Route Configurations
Router.configure({
    layoutTemplate: 'layoutsDefault',
    loadingTemplate: 'commonLoading'
});

// Login / Signup
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
Router.plugin('ensureSignedIn', {
    except: ['splash', 'home', 'about', 'profile']
});

// Pages
    // Splash
    Router.route('/', {
        name: 'splash',
        template: 'pagesSplash'
    });
    // Home
    Router.route('/home', {
        name: 'home',
        template: 'pagesHome'
    });
    // About
    Router.route('/about', {
        name: 'about',
        template: 'pagesAbout'
    });

// User
    // Profile
    Router.route('/profile', {
        name: 'profile',
        template: 'userProfile'
    });