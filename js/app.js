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
		var val = $(this).find('input').val();

		if ( val.length > 0 ) { 
			$(this).siblings('ul')
				.empty()
				.addClass('is-matched') //only needs to happen when element is focussed
				.css('display', 'block'); //only needs to happen when element is focussed

			items.forEach(function(el) {
				if ( el.product.indexOf(val) > -1 ) { 
					$(that).siblings('ul').append('<li>' + el.product + '</li>');
				}
			});
			if ( !$(this).siblings('ul').children().length ) { //remove if empty
				$(this).siblings('ul')
					.css('display', 'none')
					.removeClass('is-matched')
					.empty();
			}
		} else {
			$(this).siblings('ul')
				.css('display', 'none')
				.removeClass('is-matched')
				.empty();
		}
	});
}

function setOnBlur() {
	$('.list__product input').blur(function() {
		$(this).parent().siblings('ul')
			.css('display', 'none')
			.removeClass('is-matched')
			.empty();
	});
}

function enableLineItemClick() {
	// try without .off() >:)
	// $('.list__product ul li').off()
	$('.list__product ul li').click(function(){log('hi');});
}

/* ----- DOC READY ----- */
$(document).ready(function() {
	setPredictiveType();
	setOnBlur();
});

