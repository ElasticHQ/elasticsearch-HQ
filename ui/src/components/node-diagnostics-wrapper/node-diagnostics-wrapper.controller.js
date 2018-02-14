import './node-diagnostics-wrapper.style.scss'

class nodeDiagnosticsWrapperController {
    constructor($sce) {
        'ngInject';

        this.$sce = $sce;
    }

    $doCheck() {
        if (!angular.equals(this._nodeInfo, this.nodeInfo)) {
            this._nodeInfo = this.nodeInfo;
            this.stageData()
        }
    }

    stageData() {
        if (!this._nodeInfo) return this._rules = undefined;
        let arr = [];
        arr.push({title: "File System", icon: "fa fa-info", key: 'fs_rules'});
        arr.push({title: "Actions", icon: "fa fa-info", key: 'action_rules'});
        arr.push({title: "Cache", icon: "fa fa-info", key: 'cache_rules'});
        arr.push({title: "Memory", icon: "fa fa-info", key: 'memory_rules'});
        arr.push({title: "Network", icon: "fa fa-info", key: 'network_rules'});

        // Create the Popeover Content
        arr.forEach((itm) => {
            this._nodeInfo[itm.key].map((rule) => {
                rule.popoverContent = this.popOverContent(rule);
                return rule
            })
        })
        this._rules = arr;
    }

    // Pre-render html for popover content since
    //  we need to $sce.trustAsHtml for it to render 
    //  correctly in the popover template.
    popOverContent(rule) {
        let html = ''
        if (rule.rule_comment) {
            html += `<div class="alert alert-info"><i class="fa fa-info-circle"></i> ${rule.rule_comment}</div>`;
        }
        html += '<ul>';
        html += `<li><b>Keys: </b>${rule.rule_formula}</li>`;
        html += `<li><b>Keys: </b>${rule.formula_repl}</li>`;
        html += '</ul>';
        return this.$sce.trustAsHtml(html);
    }

}

export default nodeDiagnosticsWrapperController;
