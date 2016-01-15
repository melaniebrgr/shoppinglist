/* ----- CONVENIENCE METHOD ----- */
function log(m) {
	console.log(m);
}
log('');

/* ----- APP ----- */
var items;

$.getJSON("js/items.json").done(function(data) {
		items = data.items.sort(function(a, b) { //sort items alphabetically by product name
			if (a.product < b.product) { return -1; }
			if (a.product > b.product) { return 1; }
			return 0;
		});
});

function isNumber( num ) {
	return typeof num === 'number' && isFinite(num);
}

function toTwoDecimals( num ) {
	return num.toFixed(2);
}

function calculateTotal() {
	//when called, get all the price input values
	//coerce to numbers, check if number
	//sum together
	//update total
	var sum = 0;
	var $priceInputs = $('.list__price input');

	$priceInputs.each(function() {
		var inputVal = +$(this).val();
		if ( isNumber(inputVal) ) {
			sum += inputVal;
		}
	});
	sum ? $('.total__price').text("$" + toTwoDecimals(sum) ) : $('.total__price').text("$" + 0);
}

function clearPrice( $row ) {
	$row.find('.list__price').children('input').val('');
	calculateTotal();
}

function clearQuantity( $row ) {
	$row.find('.list__quantity').children('input').val('');
}

function closeItemsList( list ) {
	list.css('display', 'none').removeClass('is-matched').empty(); 
}

function getPrice( item, quantity ) {
	//validate quantity input is a number
	//determines if kg is included
	//returns object with quantity and ppU/ppKg
	var priceData = {
		amount: 0,
		multiplier: 0
	};

	var amount = +quantity.match(/\d*\.?\d*/)[0];
	if ( isNumber(amount) ) { 
			priceData.amount = amount;
		if ( /([kK][gG][sS]?)$/.test(quantity) ) {
			priceData.multiplier = item.ppKilo;
		} else {
			priceData.multiplier = item.ppUnit;
		}
	} else {
		alert("You must enter a number or weight in kilograms");
	}
	return toTwoDecimals(priceData.amount * priceData.multiplier);
}

function setPrice( $row ) {
	var quantity, product, price;
	var $qtyInput = $row.find('.list__quantity').children('input');
	var $priceInput = $row.find('.list__price').children('input');
	var $prodInput = $row.find('.list__product').children('input');
	$qtyInput.val() === "" ? ( quantity = "1", $qtyInput.val(quantity) ) : ( quantity = $qtyInput.val() );
	product = $prodInput.val();

	items.forEach(function(el) {
		if ( el.product === product ) {
			price = getPrice( el, quantity );
			return;
		}
	});
	$priceInput.val(price);
	calculateTotal();
}

function handleListBlur() {
	$('.list__product input').blur(function() {
		var $itemsList = $(this).parent().siblings('ul');
		if ( !$itemsList.is(':hover') ) { 
			closeItemsList( $itemsList );
		}
	});
}

function handleQuantityInput() {
	$('.list__quantity input').keyup(function() {
		var $row = $(this).closest('div[class^=row]');
		var quantity = $(this).val();
		var product = $row.find('.list__product').children('input').val();
		if (quantity.length && product.length) {
			setPrice($row);
		} else {
			clearPrice($row);
		}
	});
}

function handlePriceInput() {
	$('.list__price input').keydown(function(e) {
		if (e.which === 9) {
			$(this).val( toTwoDecimals( +$(this).val() ) );
		}
	});
	$('.list__price input').keyup(function() {
		calculateTotal();
	});
}

function handleLineItemClick( $itemsList ) {
	//remove any present event handlers
	//set product input value to clicked item
	//hide the items list
	//set the price for this row
	$itemsList.find('li').off();
	$itemsList.find('li').click(function() {
		var $row = $(this).closest('div[class^=row]');
		var $products = $row.find('.list__product');
		$products.children('input').val($(this).text());
		closeItemsList($products.siblings('ul'));
		setPrice($row);
	});
}

function formatItemStr( item, product ) {
	//takes matching array element, and product input value
	//returns formated string
	var firstMatchingCharIndex = item.product.indexOf(product);
	var lastMatchingCharIndex = firstMatchingCharIndex + product.length - 1;
	var productCharArr = item.product.split('');
	var formattedStr = '';

	productCharArr.forEach(function(el, i) {
		if ( i === (firstMatchingCharIndex) ) {
			formattedStr += '<span class="is-matching-char">' + el;
			if ( product.length === 1 ) { formattedStr += '</span>'; }
		} else if ( i === (lastMatchingCharIndex) ) {
			formattedStr += el + '</span>';
		} else {
			formattedStr += el;
		}
	});	
	return formattedStr;
}

function setPredictiveType() {
	//On keyup, check if there is any input in the product field
	//If there is, display the items list
	//then look through the array of items and display any matching products in the list 
	//matching characters are bolded
	//if there are items in the list, attach click event handlers to them; 
	// if there aren't any items or you've deleted the text in the input, remove the items list

	var downArrowCount = -1;

	$('.list__product input').keyup(function(e) {
		var $row = $(this).closest('div[class^=row]');
		var $itemsList = $(this).parent().siblings('ul');
		var product = $(this).val();
		var productLineWidth = $(this).parent().width();

		if ( product.length > 0 ) { 
			$itemsList.empty();
			for(var i = 0; i < items.length; i++) {
				var el = items[i];
				if ( el.product === product ) {
					setPrice($row);
					closeItemsList($itemsList);
					break;
				}
				if ( el.product.indexOf(product) > -1 ) {
					$itemsList.addClass('is-matched').css('width', productLineWidth).css('display', 'block');
					$itemsList.append('<li>' + formatItemStr(el,product) + '</li>');
				}
			}
			if ( $itemsList.children().length ) { 
				handleLineItemClick($itemsList);
				if ( e.which === 40 ) {
					$itemsList.children().eq( downArrowCount ).removeClass('is-highlighted-li');
					downArrowCount++;
					$itemsList.children().eq( downArrowCount ).addClass('is-highlighted-li');
				} else if ( e.which === 38 ) {
					$itemsList.children().eq( downArrowCount ).removeClass('is-highlighted-li');
					downArrowCount === -1 ? downArrowCount = -1 : downArrowCount--;
					$itemsList.children().eq( downArrowCount ).addClass('is-highlighted-li');
				} else if ( e.which === 13 && downArrowCount > -1 ) {
				    e.preventDefault();
					$(this).val( $itemsList.children().eq( downArrowCount ).text() );
					setPrice($row);
					closeItemsList($itemsList);
					downArrowCount = -1;
				} else {
					downArrowCount = -1;
				}
			}
		} else { 
			closeItemsList($itemsList);
			clearPrice($row);
			clearQuantity($row);
		}
	});
}

/* ----- DOC READY ----- */
$(document).ready(function() {
	setPredictiveType();
	handleListBlur();
	handleQuantityInput();
	handlePriceInput();
});

