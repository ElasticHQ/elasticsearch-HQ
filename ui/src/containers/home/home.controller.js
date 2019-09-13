import './home.style.scss';

const fooImage = require('../../images/foo.gif');

/**
 * 
 * Copied from https://stackoverflow.com/a/45075028/216135
 * We rely on new URL to parse, but at times things like http 
 * with PORT 80 that is required in the URL does not get passed.
 * Same with https & PORT 443.
 * For those cases, we parse using the REGEX below.
 * 
 * TESTED with:
 *  - http://10.10.10.10:80
 *  - http://test:1test@10.10.10.10:80
 *  - https://test:1test@localhost:9200
 * 
 * NOTE: THIS FAILS WITH iPV6 until REGEX is updated in group 3.
 */
const url2obj = url => {
    // Don't fail with undifined string, capture and alert in another location.
    if (!url) return {};

    var pattern = /^(?:([^:\/?#\s]+):\/{2})?(?:([^@\/?#\s]+)@)?([^\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;
    var matches =  url.match(pattern);
    var params = {};
    if (matches[5] != undefined) { 
       matches[5].split('&').map(function(x){
         var a = x.split('=');
         params[a[0]]=a[1];
       });
    }

    return {
        protocol: matches[1],
        user: matches[2] != undefined ? matches[2].split(':')[0] : undefined,
        password: matches[2] != undefined ? matches[2].split(':')[1] : undefined,
        host: matches[3],
        hostname: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[0] : undefined,
        port: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[1] : undefined,
        segments : matches[4] != undefined ? matches[4].split('/') : undefined,
        params: params 
    };
}

class homeController {
    constructor(ClusterConnection, $rootScope, $state, $timeout, Notification) {
        'ngInject';

        this.service = ClusterConnection;
        this.$state = $state;

        this.$timeout = $timeout;
        this.Notification = Notification;

        this.connection = 'http://localhost:9200';
        $rootScope.$on('root.default-url-updated', (evt, data) => {
            this.connection = data.default_url
        })
    }


    connect() {
        console.log('---- see request to connect', this.connection)
        let data = this.parseURI();
        console.log('----- parse?', data)
        this.service.connectCluster(data).then((resp) => {

            let cluster = resp.data.data[0];
            this.$timeout(() => {
                this.Notification.success({message: `Connected successfully`, delay: 3000});
            }, 100)
            this.$state.transitionTo('clusterDetails', {clusterName: cluster.cluster_name}, {reload: true})
            // this.$state.go('configuration.users.detail', {user_id: user.id}, {reload: true});
            console.log('----- state: ', this.$state)
        }, (err) => {
            if (err.status == 404) {
                this.Notification.error({message: `Cluster connection Failed! <br/><br/> Check server logs if problem persists.`, delay: 3000});
            } else if (err.status == 401) {
                this.Notification.error({message: `Cluster connection Failed! <br/><br/> Server responded with UNAUTHORIZED.`, delay: 3000});
            }
            console.log('ERR: ' , err);
        })
    }

    parseURI() {
        let uri = new URL(this.connection);
        let secondParse = url2obj(this.connection)

        let tmp = {
            ip: uri.hostname,
            port: uri.port || secondParse.port,
            username: uri.username,
            password: uri.password,
            use_ssl: (uri.protocol === 'https:')
        };
        return tmp
    }
}

export default homeController;
