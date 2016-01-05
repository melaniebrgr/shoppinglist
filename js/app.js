/* ----- CONVENIENCE METHOD ----- */
function log(m) {
	console.log(m);
}

/* ----- APP ----- */
var items;

$.getJSON("js/items.json")
	.done(function(data) {
		items = data.items.sort(function(a, b) { //sort items alphabetically by product name
			if (a.product < b.product) { return -1; }
			if (a.product > b.product) { return 1; }
			return 0;
		});
	});

function setPredictiveType() {
	$('.list__product').keyup(function(e) {
		var that = this;
		var val = $('.list__product input').val();

		if ( val.length > 0 ) { 
			$(that).siblings('ul')
				.empty()
				.addClass('is-matched') //only needs to happen when element is focussed
				.css('display', 'block'); //only needs to happen when element is focussed

			items.forEach(function(el, i, arr) {
				if ( el.product.indexOf(val) > -1 ) { 
					$(that).siblings('ul').append('<li>' + el.product + '</li>');
				}
			});
			
			//if there were no matches (no list items)
			log($(that).siblings('ul').length);
			// $(that).siblings('ul').append('<li> No matches :( </li>');
		} else {
				$(that).siblings('ul').css('display', 'none').removeClass('is-matched').empty();
		}
	});
}

/* ----- DOC READY ----- */
$(document).ready(function() {
	setPredictiveType();
});

