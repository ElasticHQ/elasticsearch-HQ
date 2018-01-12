import './top-nav.style.scss'

class topNavController {
    constructor(ClusterConnection) {
        'ngInject';

        this.service = ClusterConnection;

        this.connection = 'htts://10.0.0.182:9200'

        console.log('---- I am in the top nav.....')
    }

    inputChanged(){
        console.log('---- this.masterShared', this.masterShared)
    }

    connect() {
        console.log('---- see request to connect', this.connection)
        let data = this.parseURI();
        console.log('----- parse?', data)
        this.service.connectCluster(data).then((resp) => {
                console.log('----- got something???', resp)
        }, (err) => {

        })
    }

    parseURI() {
        let uri = new URL(this.connection);
        console.log('---- uri: ', uri)
        let tmp = {
            ip: uri.hostname,
            port: uri.port,
            use_ssl: (uri.protocol === 'https:')
        }
        return tmp
    }

}

export default topNavController;
