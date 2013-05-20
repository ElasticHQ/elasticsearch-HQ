var ajaxloading = {
    show:function () {
        $('#ajaxindicator').fadeIn({duration:1000});
    },
    hide:function () {
        $('#ajaxindicator').fadeOut({duration:1000});
    }
}

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
};

/**
 * Notification system. https://github.com/sciactive/pnotify
 * @type {Object}
 */
var stack_bottomright = {"dir1":"up", "dir2":"left", "firstpos1":25, "firstpos2":25};
function show_stack_bottomright(args) {
    var opts = {
        title:args.title,
        text:args.text,
        addclass:"stack-bottomright",
        stack:stack_bottomright,
        styling:"bootstrap",
        history:false,
        icon:true,
        hide:(args.hide == undefined) ? true : args.hide,
        closer_hover:(args.closer_hover == undefined) ? true : args.closer_hover,
        delay:5000
    };
    switch (args.type) {
        case 'error':
            opts.type = "error";
            break;
        case 'info':
            opts.type = "info";
            break;
        case 'success':
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};

/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes     Number of bytes to convert
 * @param integer precision Number of digits after the decimal separator
 * @return string
 */
var convert = {
    bytesToSize:function (bytes, precision) {
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;

        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B';

        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB';

        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB';

        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB';

        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB';

        } else {
            return bytes + ' B';
        }
    }
};

function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};