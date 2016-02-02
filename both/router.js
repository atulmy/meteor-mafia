// Route Configurations
Router.configure({
    layoutTemplate: 'layoutsDefault',
    loadingTemplate: 'commonLoading'
});

// Check authentication for routes or except routes
var loginCheck = function(){
    if(!Meteor.user()) {
        if(Meteor.loggingIn()){
            this.render("commonLoading");
        } else {
            this.render("layoutsAccounts");
        }
    } else {
        this.next();
    }
};

Router.onBeforeAction(loginCheck, {
    except: ['splash', 'how', 'about', 'contact']
});

// Pages
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
    // Contact
    Router.route('/goodbye', {
        name: 'goodbye',
        template: 'pagesGoodbye',
        layoutTemplate: 'layoutsFull'
    });

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
                return [Meteor.subscribe('game', this.params.gameId), Meteor.subscribe('notificationsGame', this.params.gameId)];
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
                return [Meteor.subscribe('game', this.params.gameId), Meteor.subscribe('notificationsGame', this.params.gameId)];
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
    Router.route('/profile/default', {
        name: 'profileDefault',
        template: 'userProfileDefault',
        layoutTemplate: 'layoutsFull'
    });