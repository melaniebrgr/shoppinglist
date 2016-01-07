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
		if ( !$(this).parent().siblings('ul').is(':hover') ) { 
			$(this).parent().siblings('ul')
				.css('display', 'none')
				.removeClass('is-matched')
				.empty();
		}
	});
}

function calculatePrice( $products ) {
	var price, itemData;

	var $qtyInput = $products.parent().siblings().children('.list__quantity').children('input');
	var $priceInput = $products.parent().siblings().children('.list__price').children('input');
	var $prodInput = $products.children('input');
	var product = $prodInput.val();
	var quantity = $qtyInput.val() || 1;

	//find or retrieve matched product
	items.forEach(function(el) {
		if ( el.product === product ) { 
			itemData = el;
			price = el.ppUnit*quantity;
			$priceInput.val(price);
			return;
		}
	});
	// log(price);
}

function enableLineItemClick( $itemsList ) {
	$itemsList.find('li').off();
	$itemsList.find('li').click(function() {
		log('test');
		var $products = $(this).parent().siblings('.list__product');
		$products.children('input').val( $(this).text() );
		$products.siblings('ul')
			.css('display', 'none')
			.removeClass('is-matched')
			.empty();
		calculatePrice( $products );
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
					var firstMatchingCharIndex = el.product.indexOf(val);
					var lastMatchingCharIndex = firstMatchingCharIndex + val.length - 1;
					var productCharArr = el.product.split('');
					var highlightedStr = '';
					productCharArr.forEach(function(el, i) { //reformat prodcut strng with new class
						if ( i === (firstMatchingCharIndex) ) {
							highlightedStr += '<span class="is-matching-char">' + el;
							if ( val.length === 1 ) { highlightedStr += '</span>'; }
						} else if ( i === (lastMatchingCharIndex) ) {
							highlightedStr += el + '</span>';
						} else {
							highlightedStr += el;
						}
					});
					$itemsList.append('<li>' + highlightedStr + '</li>');
				}
			});

			if ( $itemsList.children().length ) {
				enableLineItemClick( $itemsList ); //if product(s) match, attach event handlers
			} else { //update if no product matches
				$itemsList
					.css('display', 'none')
					.removeClass('is-matched')
					.empty();
					// .append('<li> no matches :( </li>');
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

