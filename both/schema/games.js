// Schema for games collection

var city = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String
    }
});

var player = new SimpleSchema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    ready: {
        type: Boolean
    },
    character: {
        type: Number
    },
    alive: {
        type: Boolean
    },
    settings: {
        type: new SimpleSchema({
            sounds: {
                type: Boolean
            }
        })
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
        type: [player]
    }
});

var is = new SimpleSchema({
    publicGame: {
        type: Boolean
    },
    started: {
        type: Boolean
    },
    finished: {
        type: Boolean
    }
});

var round = new SimpleSchema({
    votes: {
        type: [new SimpleSchema({
            against: {
                type: Number
            },
            self: {
                type: Number
            },
            done: {
                type: Boolean
            }
        })]
    },
    votingEnabled: {
        type: Boolean
    },
    votingDone: {
        type: Boolean
    },
    doctor: {
        type: new SimpleSchema({
            against: {
                type: Number
            },
            done: {
                type: Boolean
            },
            saved: {
                type: Boolean
            }
        })
    },
    detective: {
        type: new SimpleSchema({
            against: {
                type: Number
            },
            done: {
                type: Boolean
            },
            guessed: {
                type: Boolean
            }
        })
    },
    mafia: {
        type: new SimpleSchema({
            against: {
                type: Number
            },
            done: {
                type: Boolean
            },
            killed: {
                type: Boolean
            }
        })
    }
});

var activity = new SimpleSchema({
    text: {
        type: String
    },
    when: {
        type: Date
    }
});

var discussion = new SimpleSchema({
    name: {
        type: String
    },
    message: {
        type: String
    }
});

var notify = new SimpleSchema({
    round: {
        type: Boolean
    },
    killed: {
        type: Boolean
    },
    discussion: {
        type: Boolean
    }
});

Games.attachSchema(new SimpleSchema({
    city: {
        type: city
    },

    players: {
        type: players
    },

    rounds: {
        type: [round]
    },

    activities: {
        type: [activity]
    },

    discussions: {
        type: new SimpleSchema({
            user: {
                type: [discussion]
            },
            mafia: {
                type: [discussion]
            }
        })
    },

    notify: {
        type: notify
    },

    settings: {
        type: new SimpleSchema({
            paused: {
                type: Boolean
            }
        })
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