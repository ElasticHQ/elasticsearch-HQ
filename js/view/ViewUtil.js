Backbone.Collection = Backbone.Collection.extend({
    clear:function () {

    }
});

var timeUtil = {
    lastUpdated:function () {
        var dt = new Date();
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var seconds = dt.getSeconds();
        if (hours < 10)
            hours = '0' + hours;

        if (minutes < 10)
            minutes = '0' + minutes;

        if (seconds < 10)
            seconds = '0' + seconds;
        return hours + ":" + minutes + ":" + seconds;
    }
}