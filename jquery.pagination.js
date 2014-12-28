/**
 * jQuery Pagination
 * Creates a group of pagination anchors that allow a user to view every page in
 * a set
 * @author Chris Nasr
 * @copyright FUEL for the FIRE (free for non-commercial use)
 * @version 0.1
 * @date 2014-12-28
 */
(function ( $ )
{
	$.fn.pagination	= function(options)
	{
		// Default options
		var aOptions	= {
			"fetch":			false,
			"load":				false
		};



		return this;
	};

}(jQuery));

var __jQueryPagination	= {
	"fetch":		function(url, method) {
		// Make the request
		$.ajax(url, {
			"dataType":		'json',
			"error":		function(jqXHR, textStatus, errorThrown) {
				alert('jquery.pagination experienced an error fetching the json set: ' + textStatus + '(' + errorThrown + ')');
			},
			"success":		function(json, textStatus, jqXHR) {
				// Call the load method
				__jQueryPagination.load(json);
			},
			"type":			(typeof method == 'undefined') ? 'get' : method,
		})
	},

	"load":			function(json) {

	}
};