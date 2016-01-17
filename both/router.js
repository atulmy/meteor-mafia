// Route Configurations
Router.configure({
    layoutTemplate: 'layoutsDefault',
    loadingTemplate: 'commonLoading'
});

// Login / Signup
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
Router.plugin('ensureSignedIn', {
    except: ['splash', 'how', 'about', 'contact']
});
AccountsTemplates.configureRoute('ensureSignedIn', {
    layoutTemplate: 'layoutsAccounts',
});
AccountsTemplates.configure({
    onLogoutHook: function(){
        //example redirect after logout
        Router.go('splash');
    }
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
            template: 'pagesJoin',
            waitOn: function() {
                return Meteor.subscribe('gamesRecent');
            }
        });
        // Players
        Router.route('/game/:gameId', {
            name: 'game',
            template: 'gamePlayers',
            layoutTemplate: 'layoutsFull',
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
        // Play
        Router.route('/game/:gameId/play', {
            name: 'gamePlay',
            template: 'gamePlay',
            layoutTemplate: 'layoutsFull',
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
        template: 'pagesSplash',
        layoutTemplate: 'layoutsFull',
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
        template: 'pagesContact',
        waitOn: function() {
            return Meteor.subscribe('userDetails');
        }
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