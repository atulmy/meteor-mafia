// Route Configurations
Router.configure({
    layoutTemplate: 'layoutsDefault',
    loadingTemplate: 'commonLoading'
});

// Login / Signup
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
Router.plugin('ensureSignedIn', {
    except: ['splash', 'how', 'about']
});

// Pages
    // Game
        // Home
        Router.route('/home', {
            name: 'home',
            template: 'pagesHome'
        });
        // Join
        Router.route('/join', {
            name: 'join',
            template: 'pagesJoin'
        });
        // Play
        Router.route('/play/:gameId', {
            name: 'play',
            template: 'pagesPlay',
            waitOn: function() {
                return Meteor.subscribe('game', this.params.gameId);
            },
            onBeforeAction: function() {
                Session.set('gameId', this.params.gameId);
                this.next();
            },
            onStop: function() {
                // Clear game id in session
                Session.set('gameId', '');
            }
        });

    // Splash
    Router.route('/', {
        name: 'splash',
        template: 'pagesSplash'
    });
    // How
    Router.route('/how-to-play', {
        name: 'how',
        template: 'pagesHow'
    });
    // About
    Router.route('/about', {
        name: 'about',
        template: 'pagesAbout'
    });
    // Contact
    Router.route('/contact', {
        name: 'contact',
        template: 'pagesContact'
    });

// User
    // Profile
    Router.route('/profile', {
        name: 'profile',
        template: 'userProfile'
    });
    Router.route('/profile/edit', {
        name: 'profileEdit',
        template: 'userProfileEdit'
    });