/*
 Copyright 2013 Roy Russo

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Latest Builds: https://github.com/royrusso/elasticsearch-HQ
 */

/**
 Following the backbone vernacular. This obj simply handles the draw on the upper main screen.
 */
var ClusterHealthView = Backbone.View.extend({
    template:_.template($('#clusterHealth-template').html()),
    modalTemplate:_.template($('#clusterHealth-modal-template').html()),
    render:function () {
        var clusterHealth = this.model;
        console.log('Drawing clusterHealth ' + clusterHealth.get('cluster_name'));
        if (clusterHealth) {
            var status = clusterHealth.get('status');
            if (status == 'yellow') {
                clusterHealth.set({statusClass:'warning'});
            }
            else if (status == 'green') {
                clusterHealth.set({statusClass:'success'});
            }
            else if (status == 'red') {
                clusterHealth.set({statusClass:'danger'});
            }
            $(this.el).html(this.template(clusterHealth.attributes));

            // populate the modal, just in case.
            $('#clusterHealthModal').html(this.modalTemplate(clusterHealth.attributes));

            $("[rel=popRight]").popover({});
        }
        return this;
    }
});
