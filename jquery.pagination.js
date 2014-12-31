/**
 * jQuery Pagination
 * Creates a group of pagination anchors that allow a user to view every page in
 * a set
 * @author Chris Nasr
 * @copyright FUEL for the FIRE (free for non-commercial use)
 * @version 0.1
 * @date 2014-12-28
 */

/**
 * jQuery Pagination Object
 *
 * Used by the pagination function to handle the processing in a cleaner way.
 * Could be used directly, but relies on jQuery so can not exist stand alone.
 *
 * @name __jQueryPagination
 * @type Object
 */
var __jQueryPagination	= {
	/**
	 * Change Page
	 *
	 * Used to change the currently selected page
	 *
	 * @name changePage
	 * @param jQuery el					The element the pagination was created in
	 * @return void
	 */
	"changePage":		function(el)
	{

	},

	"click":			function(opts, ev) {
		ev.preventDefault();
		alert((this.innerHTML == opts.page) ? 'this page' : 'page ' + this.innerHTML);
		return false;
	},

	/**
	 * Fetch
	 *
	 * Fetchs the data for the pagination from a URL
	 *
	 * @name fetch
	 * @param jQuery el					The element the pagination will be created in
	 * @return void
	 */
	"fetch":		function(el)
	{
		// Get the options
		var aOpts	= el.data('opts');

		// Make the request
		jQuery.ajax(aOpts.fetch, {
			"dataType":		'json',
			"error":		function(jqXHR, textStatus, errorThrown) {
				alert('jquery.pagination experienced an error fetching the json set: ' + textStatus + '(' + errorThrown + ')');
			},
			"success":		function(json, textStatus, jqXHR) {
				// Set the load parameter
				aOpts.load	= json;

				// Store the options
				el.data('opts', $aOpts);

				// Call the load method
				__jQueryPagination.load(el);
			},
			"type":			aOpts.method,
		});
	},

	/**
	 * jQuery
	 *
	 * jQuery's way into the class
	 *
	 * @name jquery
	 * @param Object options
	 * @return jQuery
	 */
	"jquery":		function(opts, secondary)
	{
		// If the type of options is a string
		if(typeof opts == 'string')
		{
			// What is the string?
			switch(opts)
			{
				// Destroy the pagination
				case 'destroy':
					kQuery.destroy(this);
					break;

				// Change the currently active page
				case 'page':
					__jQueryPagination.changePage(this, typeof secondary == 'undefined' ? 1 : secondary);
					break;

				// Invalid option
				default:
					throw Exception('Invalid use of jquery.pagination. Unknown option: ' + opts);
			}

			// Return for chaining
			return this;
		}

		// Default options
		var aOpts	= {
			"show"	:			10,
			"fetch":			false,
			"load":				false,
			"method":			'get',
			"page":				1,
			"showFirst":		true,
			"showLast":			true,
			"showNext":			true,
			"showPrevious":		true,
			"target":			false
		};

		// Override defaults with passed options
		if(opts) {
			jQuery.extend(aOpts, opts);
		}

		// Now init shared data
		aOpts.list	= false;

		// Add the options to the element
		this.data('opts', aOpts);

		// If load is set
		if(typeof aOpts.load == 'object')
		{
			// Load the given object
			__jQueryPagination.load(this);
		}
		// Else, if fetch is set
		else if(typeof aOpts.fetch == 'string')
		{
			// Try to fetch the given URL
			__jQueryPagination.fetch(this);
		}
		// Else, throw an exception
		else
		{
			throw Exception('Invalid use of jquery.pagination. Must pass an object to load, or a url to fetch.');
		}

		// Return for chaining
		return this;
	},

	/**
	 * Limits
	 *
	 * Calculates which and how many pages to show based on the current page,
	 * total pages, and optional parameters
	 *
	 * @name limites
	 * @param Object opts				Options to the pagination
	 * @param uint total				The total number of pages
	 * @return Object
	 */
	"limits":		function(opts, total)
	{
		// Initialise the limits
		var oLimits	= {};

		// Store the total
		oLimits['total']		= total;

		// Additional pages are the total minus the current page
		oLimits['additional']	= opts.show - 1;

		// Figure out how many additional pages to show
		oLimits['toShow']		= (total <= oLimits['additional']) ? (total - 1) : oLimits['additional'];

		// Get the pre and post lengths
		if(oLimits['toShow'] % 2 == 0) {
			oLimits['pre']	= oLimits['toShow'] / 2;
			oLimits['post']	= oLimits['pre'];
		} else {
			oLimits['pre']	= Math.floor(oLimits['toShow'] / 2);
			oLimits['post']	= oLimits['pre'] + 1;
		}

		// If the current page is less than the pre pages
		if(opts.page <= oLimits['pre'])
		{
			oLimits['pre']	= opts.page - 1;
			oLimits['post']	= oLimits['toShow'] - oLimits['pre'];
		}
		// Else if the total pages minus the current page is less than the
		//	post pages
		if(total - opts.page <= oLimits['post'])
		{
			oLimits['post']	= total - opts.page;
			oLimits['pre']	= oLimits['toShow'] - oLimits['post'];
		}

		// Return the limits
		return oLimits;
	},

	/**
	 * Load
	 *
	 * Parses the pagination data and creates all the necessary elements
	 *
	 * @name load
	 * @param jQuery el					The element the pagination will be created in
	 * @param Object options			The options to the pagination method
	 * @param Object data				The pagination data
	 * @return void
	 */
	"load":			function(el)
	{
		// Get the options
		var aOpts	= el.data('opts');

		// If we got a list of urls
		if(aOpts.load.constructor === Array)
		{
			aOpts.list	= true;
		}
		// Else, check all params are set
		else
		{
			if(typeof aOpts.load.total == 'undefined' ||
				typeof aOpts.load.template == 'undefined') {
				throw Exception('Invalid use of jquery.pagination. Must pass total and template');
			}
		}

		// Get the limits
		aOpts.limits	= __jQueryPagination.limits(
			aOpts,
			aOpts.list ? aOpts.load.length : aOpts.load.total
		);

		// Go through each element
		el.each(function() {
			// Store jQueried scope
			var $this		= $(this);

			// Add the pagination class
			$this.addClass('pagination');

			// Generate click function
			var	fClick	= function(ev) {
				__jQueryPagination.click.apply(this, [aOpts, ev]);
			};

			// If we need to show the "previous" link
			if(aOpts.showPrevious) {
				// @TODO Show Previous
			}

			// If we need to show the "first" link
			if(aOpts.showFirst) {
				// @TODO Show First
			}

			// Add the previous pages
			var sURL, jA;
			for(var i = aOpts.page - aOpts.limits.pre; i < aOpts.page; ++i)
			{
				// Generate the URL
				sURL	= __jQueryPagination.url(aOpts, i);

				// Create a new anchor
				jA		= jQuery(
					'<a class="pre" href="' + sURL + '" ' +
					(aOpts.target ? ' target="' + aOpts.target + '"' : '') +
					'>' + i + '</a>'
				);

				// Attach a callback
				jA.click(fClick);

				// Append the anchor
				$this.append(jA);
			}

			// Generate the URL
			sURL	= __jQueryPagination.url(aOpts, aOpts.page);

			// Create a new anchor
			jA		= jQuery(
				'<a class="selected" href="' + sURL + '" ' +
				(aOpts.target ? ' target="' + aOpts.target + '"' : '') +
				'>' + aOpts.page + '</a>'
			);

			// Attach a callback
			jA.click(fClick);

			// Append the anchor
			$this.append(jA);

			// Add the next pages
			var iForCond	= aOpts.page + aOpts.limits.post + 1;
			for(var i = aOpts.page + 1; i < iForCond; ++i)
			{
				// Generate the URL
				sURL	= __jQueryPagination.url(aOpts, i);

				// Create a new anchor
				jA		= jQuery(
					'<a class="post" href="' + sURL + '" ' +
					(aOpts.target ? ' target="' + aOpts.target + '"' : '') +
					'>' + i + '</a>'
				);

				// Attach a callback
				jA.click(fClick);

				// Append the anchor
				$this.append(jA);
			}

			// If we need to show the "last" link
			if(aOpts.showLast) {
				// @TODO Show Last
			}

			// If we need to show the next button
			if(aOpts.showNext) {
				// @TODO Show Next
			}
		});
	},

	/**
	 * URL
	 *
	 * Generates a URL for the given page based on the pagination options
	 *
	 * @name url
	 * @param Object opts				Options to the pagination
	 * @param uint page					The page number
	 * @return string
	 */
	"url":			function(opts, page)
	{
		// If we have a list
		if(opts.list)
		{
			// Return the list item
			return opts.load[page-1];
		}
		// Else if we have an object
		else
		{
			// If it's page one and we have a page one
			if(page == 1 && typeof aOpts.load.first == 'string') {
				return aOpts.load.first;
			}
			// Else generate the page using the template
			else {
				return aOpts.load.template.replace('#PAGE#', page);
			}
		}
	}
};

// Add to jQuery
jQuery.fn.pagination	= __jQueryPagination.jquery;
