import './home.style.scss';

const fooImage = require('../../images/foo.gif')

class homeController {
    constructor(ClusterConnection, $state) {
        'ngInject';

        this.service = ClusterConnection;
        this.$state = $state;

        this.connection = 'http://10.0.0.182:9200'
    }

    connect() {
        console.log('---- see request to connect', this.connection)
        let data = this.parseURI();
        console.log('----- parse?', data)
        this.service.connectCluster(data).then((resp) => {
                console.log('----- got something???', resp)
                let cluster = resp.data.data[0];
                console.log('----- cluster: ', cluster)
                this.$state.transitionTo('clusterDetails', {clusterName: cluster.cluster_name}, {reload: true})
                // this.$state.go('configuration.users.detail', {user_id: user.id}, {reload: true});
                console.log('----- state: ', this.$state)
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

export default homeController;