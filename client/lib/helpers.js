// Operators
    // = equal to
    Template.registerHelper('equalTo', function (a, b) {
        return a === b;
    });

    // != not equal to
    Template.registerHelper('notEqualTo', function (a, b) {
        return a !== b;
    });

    // > greater than
    Template.registerHelper('greaterThan', function (a, b) {
        return a > b;
    });
    Template.registerHelper('greaterThanOrEqualTo', function (a, b) {
        return a >= b;
    });

    // < less than
    Template.registerHelper('lessThan', function (a, b) {
        return a < b;
    });
    Template.registerHelper('lessThanOrEqualTo', function (a, b) {
        return a <= b;
    });

    // && and
    Template.registerHelper('and', function (a, b) {
        return a && b;
    });
    // || or
    Template.registerHelper('or', function (a, b) {
        return a || b;
    });

    // Not
    Template.registerHelper('not', function (a) {
        return !a;
    });

// Date Time
    // Nice
    Template.registerHelper('momentNice', function (t) {
        return moment(t).fromNow();
    });
    // Only time
    Template.registerHelper('momentTime', function (t) {
        return moment(t).format('h:mm');
    });

// Array
    // Reverse
    Template.registerHelper('arrayReverse', function (a) {
        return a.reverse();
    });
    Template.registerHelper("arrayKeyValue", function(obj){
        var result = [];
        for (var key in obj){
            result.push({key:key,value:obj[key]});
        }
        return result;
    });

// String
    // Crop
    Template.registerHelper('stringCrop', function (string, length) {
        length = (typeof length != 'undefined') ? length : 12;
        return string.substr(0, length);
    });