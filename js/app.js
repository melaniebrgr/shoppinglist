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



function setOnBlur() {
	$('.list__product input').blur(function() {
		$(this).parent().siblings('ul')
			.css('display', 'none')
			.removeClass('is-matched')
			.empty();
	});
}

function enableLineItemClick( itemsList ) {
	log('enableLineItemClick function called');
	itemsList.find('li').off();
	itemsList.find('li').click(function() {
		log('hi');
	});
}

function setPredictiveType() {
	$('.list__product input').keyup(function() {
		var $itemsList = $(this).parent().siblings('ul');
		var val = $(this).val();

		if ( val.length > 0 ) { 
			$itemsList
				.empty()
				.addClass('is-matched') //only needs to happen when element is focussed
				.css('width', $(this).parent().width())
				.css('display', 'block'); //only needs to happen when element is focussed

			items.forEach(function(el) {
				if ( el.product.indexOf(val) > -1 ) { 
					$itemsList.append('<li>' + el.product + '</li>');
				}
			});

			if ( $itemsList.children().length ) {
				enableLineItemClick( $itemsList ); //if product(s) match, attach event handlers
			} else { //update if no product matches
				$itemsList
					// .css('display', 'none')
					// .removeClass('is-matched')
					// .empty()
					.append('<li> no matches :( </li>');
			}
		} else {
			$itemsList
				.css('display', 'none')
				.removeClass('is-matched')
				.empty();
		}
	});
}

/* ----- DOC READY ----- */
$(document).ready(function() {
	setPredictiveType();
	setOnBlur();
});

