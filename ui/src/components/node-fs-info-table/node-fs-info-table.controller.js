import './node-fs-info-table.style.scss';

import numeral from 'numeral';

class nodeFsInfoTableController {
    constructor() {
        'ngInject';
    }

    $doCheck(){
        if(!angular.equals(this._fs, this.fs)){
            this._fs = this.fs;
            this.configureData();
        }
    }

    // Beacuse there could be more than 1 data item
    //  clean it up and report back on each for the table
    configureData() {
        let arr = [];
        // Format to Bytes
        const formatBytes = '0[.][0] b';
        this._fs.data.map((data, i) => {
            // Some reference of which Data item in the array
            //  belongs to each value
            const base = `Data ${i} >`;
            for (let key in data) {
                let val = data[key];
                // Check of KEY contains the word bytes
                //  IF so, then format with numeralJS
                if (/bytes/.test(key)) val = numeral(val).format(formatBytes);
                let str = `${base} ${key.replace('_', ' ')}`
                arr.push({key: str, value: val});
                
            }
            return data;
        });
        // Finally, create an exteranl array to refernce this
        this.datas = arr;

    }
}

export default nodeFsInfoTableController;
