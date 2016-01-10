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
    }
});

Games.attachSchema(new SimpleSchema({
    players: {
        type: Number
    },

    by: {
        type: userInfo
    },

    secretCityCode: {
        type: Number
    },

    isMoneyGame: {
        type: Boolean
    },

    isPublic: {
        type: Boolean
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