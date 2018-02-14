import numeral from 'numeral';

export default () => {
  'use strict';

  // set nulls to be displayed as N/A
  numeral.nullFormat('N/A');

  return (number, format) => {
    return numeral(number).format(format);
  };

};
