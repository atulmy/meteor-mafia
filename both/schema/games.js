// Schema for games collection

var userInfo = new SimpleSchema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    character: {
        type: Number
    },
    ready: {
        type: Boolean
    }
});

var players = new SimpleSchema({
    expected: {
        type: Number
    },
    joined: {
        type: Number
    },
    list: {
        type: [userInfo]
    }
});

var city = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String
    }
});

var is = new SimpleSchema({
    moneyGame: {
        type: Boolean
    },

    publicGame: {
        type: Boolean
    },

    finished: {
        type: Boolean
    }
});

Games.attachSchema(new SimpleSchema({
    players: {
        type: players
    },

    city: {
        type: city
    },

    is: {
        type: is
    },

    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    },

    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
}));