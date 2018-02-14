import './footer.style.scss';

import { compareSemVer, isValidSemVer, parseSemVer } from 'semver-parser';

class footerController {
    constructor(QueuedFactory, $sce) {
        'ngInject';

        this.que = QueuedFactory;
        this.$sce = $sce;

        this.dataSet = false;

        let req = {
            url: '/api/status',
            method: 'GET'
        }

        this.que.add(req).then((resp) => {
            let data = resp.data.data[0];
            this.dataSet = data;
            this.parseVersions();
            
        });
    }

    parseVersions() {
        this.installed_version = this.dataSet.installed_version;

        let latestStable = this.dataSet.current_stable_version;
        // For Testing
        //latestStable = "2.8.0"; //-beta.30";


        let html = '';
        // See https://github.com/asamuzaK/semverParser
        //  for details available 
        let outcome = compareSemVer(latestStable, this.installed_version)

        if (!!outcome) {
            // See if difference is simple a Patch, or something larger
            let latest = parseSemVer(latestStable);
            let installed = parseSemVer(this.installed_version);

            html = `Installed Version: <b>${this.installed_version}</b>. Latest version: `;
            if (latest.major > installed.major) {
                html += `<span class="alert alert-danger mini-alert">${latestStable}</span>`
            } else if (latest.minor > installed.minor) {
                html += `<span class="alert alert-danger mini-alert">${latestStable}</span>`
            } else if (latest.patch > installed.patch) {
                html += `<span class="alert alert-warning mini-alert">${latestStable}</span>`
            } else {
                // This would normally be beta releases
                html += `<span class="alert alert-info mini-alert">${latestStable}</span>`
            }
            html += '<br/><b>Consider upgrading!</b>'

        } else {
            html = `You are on the current version: <span class="alert alert-success mini-alert">${this.installed_version}</span>`
        }

        this.versionInfo = this.$sce.trustAsHtml(html)
    }
}

export default footerController;
