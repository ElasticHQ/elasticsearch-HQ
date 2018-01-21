import moment from 'moment';

// ISO 8601 format expected
export default function () {
  'use strict';

  return function (datetime, format) {
    return moment(datetime).format(format);
  };

}
