var lodash = _.noConflict();

$(document).ready(function () {
	$('#connectionURL').focus();
	ajaxloading.hide();
	scrollToTop.activate();

	$("[rel=tipRight]").tooltip();
	$("[rel=popRight]").popover(
			{
				'trigger': 'hover',
				'animation': true
			}
	);
});
