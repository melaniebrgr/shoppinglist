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

function calculatePrice( $row ) {
	var quantity, product, price, itemData;
	var $qtyInput = $row.find('.list__quantity').children('input');
	var $priceInput = $row.find('.list__price').children('input');
	var $prodInput = $row.find('.list__product').children('input');
	
	if ( $qtyInput.val() && !isNaN(+$qtyInput.val()) ) { 
		quantity = +$qtyInput.val();
	} else { 
		quantity = 1;
		$qtyInput.val('1'); 
	}
	product = $prodInput.val();

	items.forEach(function(el) {
		if ( el.product === product ) { 
			itemData = el;
			price = el.ppUnit*quantity;
			$priceInput.val(price);
			return;
		}
	});
}

function clearPrice( $row ) {
	$row.find('.list__price').children('input').val('');
}

function setQuantity() {
	$('.list__quantity input').keyup(function() {
		var quantity = $(this).val();
		var $row = $(this).closest('div[class^=row]');
		if ( quantity.length && !isNaN(+quantity) ) {
			if ( $row.find('.list__product').children('input').val().length ) {
				calculatePrice($row);
			}
		} else {
			clearPrice( $row );
		}
	});
}

function enableLineItemClick( $itemsList ) {
	$itemsList.find('li').off();
	$itemsList.find('li').click(function() {
		var $row = $(this).closest('div[class^=row]');
		var $products = $row.find('.list__product');
		$products.children('input').val( $(this).text() ); //set product name
		$products.siblings('ul').css('display', 'none').removeClass('is-matched').empty(); //hide list
		calculatePrice( $row );
	});
}

function setPredictiveType() {
	/*  On keyup, check if there is any input, if so, display the items list, then look through the 
	array of items and display any matching products in the list (format so match is bolded). After that, if there
	are items in the list, attach click event handlers to them; if there aren't any items or you've deleted
	the text in the input, remove the list */
	$('.list__product input').keyup(function() {
		var $row = $(this).closest('div[class^=row]');
		var $itemsList = $(this).parent().siblings('ul'); //reference to product list
		var val = $(this).val(); //value of product text field

		if ( val.length > 0 ) { 
			$itemsList.empty().addClass('is-matched').css('width', $(this).parent().width()).css('display', 'block');
			items.forEach(function(el) {
				// if ( el.product ===  )
				if ( el.product.indexOf(val) > -1 ) { //find matching characters
					var firstMatchingCharIndex = el.product.indexOf(val);
					var lastMatchingCharIndex = firstMatchingCharIndex + val.length - 1;
					var productCharArr = el.product.split('');
					var highlightedStr = '';
					productCharArr.forEach(function(el, i) { //format string
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
			if ( $itemsList.children().length ) { enableLineItemClick( $itemsList ); //attach click handler to items
			} else { $itemsList.css('display', 'none').removeClass('is-matched').empty(); } //hide list
		} else { 
			$itemsList.css('display', 'none').removeClass('is-matched').empty(); 
			clearPrice( $row );
		} //hide list

	});
}

/* ----- DOC READY ----- */
$(document).ready(function() {
	setPredictiveType();
	setOnBlur();
	setQuantity();
});

