// Schema for games collection

Notifications.attachSchema(new SimpleSchema({
    gameId: {
        type: String
    },

    text: {
        type: String
    },

    type: {
        type: String
    },

    by: {
        type: String,
        optional: true
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