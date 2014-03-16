// ======================
// jQuery.CoinTipper
// 
// Jeremy Mouton (@jeremymouton)
// https://github.com/jeremymouton/
// 
// Dependencies:
//   - jquery.js
//   - bootstrap-modal.js
//   - jquery-qrcode.js
//     - qrcode.js
// 
// ======================

(function ( $ ) {
	// Hello .coinTipper();
	$.fn.coinTipper = function(options) {
		var settings = $.extend({
			type: null,
			currency: null,
			iso: null,
			address: null,
			label: null
		}, options );
		
		button = generateDonationButton(options, this);
		return button;
	};
}( jQuery ));

function generateDonationButton(options,btn) {
	// Get the options passed to .coinTipper()
	var type     = options.type,
	    currency = options.currency,
	    iso      = options.iso,
	    address  = options.address,
	    label    = options.label;

	// Clean the Label input
	label = label.replace(/\s+/g, '+');

	// Assign and build HTML

	var modal   = buildDonateModalHtml(type, currency, iso, address, label);
	var btnHtml = buildDonateButtonHtml(type, currency);

	$(btn).replaceWith(btnHtml);
	$('body').append(modal);

	// Watch radio buttons and input field for changes.
	// Update values on change, and regenerate QR code.

	// Watch radio buttons
	$('.'+currency+'.modal input[name="donation-option"]').bind('change', function() {
		var amount = $(this).attr('value');
		generateDonationPayment(currency, address, amount, label, iso);
	});

	// Watch donation input field
	$('.'+currency+'.modal input[name="donation-amount"]').keyup( function() {
		var amount = $(this).val();
		$('.'+currency+'.modal input[name="donation-option"]').prop('checked', false);
		generateDonationPayment(currency, address, amount, label, iso);
	});
}

function generateDonationPayment(currency, address, amount, label, iso) {
	// Update DOM values, donation URI, and generate QR code.

	var uri;

	// Label specified? 
	if (label === undefined) {
		uri = currency+":"+address+"?amount="+amount;

	} else {
		uri = currency+":"+address+"?amount="+amount+"&label="+label;
	}

	// Replace DOM with new values
	$('.'+currency+'.modal input#donation-amount').val(amount);
	$('.'+currency+'.modal .span-amount').html(amount + ' ' + iso).css('font-weight','bold');
	$('.'+currency+'.modal .span-uri').attr('href',uri);
	$('.'+currency+'.modal #qrcode').html('').wrap('<a href="'+uri+'"></a>');
	$('.'+currency+'.modal #qrcode').qrcode({
		width: 170,
		height: 170,
		text: uri
	});
}

function buildDonateButtonHtml(type, currency) {
	// Build out the donation button
	var html = '<a href="" data-toggle="modal" data-target="#'+currency+'-donation-overlay" class="donate-btn '+currency+'">'+type+' '+currency+'</a>';
	return html;
}

function buildDonateModalHtml(type, currency, iso, address, label) {
	// Set the donation amounts for each currency and generate the modal.

	var html;
	var show_options = true;

	type = type.charAt(0).toUpperCase() + type.slice(1);

	// Set donation amounts
	if (currency === "bitcoin") {
		var amounts = Array(0.0005, 0.001, 0.002, 0.003, 0.005);
	} else if (currency === "dogecoin") {
		var amounts = Array(20, 50, 100, 500, 1000);
	} else if (currency === "kittehcoin") {
		var amounts = Array(200, 500, 1000, 5000, 10000);
		iso = '<small>'+iso+'</small>'
	} else {
		// Empty array and hide amount option for new coins
		var amounts = Array(0,0,0,0,0);
			show_options = false;
	}

	// Generate modal html, using Bootstrap.
	// Assign default donation values to supported coins.
	// Hide prefilled options for unsupported coins.
	if (show_options === true) {
		console.log('btc/doge/meow');
		html = '<div id="'+currency+'-donation-overlay" class="modal fade '+currency+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">'+type+' to '+label+'</h4></div><div class="modal-body"><div class="well">'+type+' <input type="text" name="donation-amount" id="donation-amount" size="4" value="" placeholder="'+amounts[0]+'"> '+iso+' to <strong>'+label+'</strong>.</div><table class="donation-options"><td>Amount:</td><td><label class="radio inline"><input id="donation-option-1" name="donation-option" type="radio" value="'+amounts[0]+'">'+amounts[0]+' '+iso+'</label></td><td><label class="radio inline"><input id="donation-option-2" name="donation-option" type="radio" value="'+amounts[1]+'">'+amounts[1]+' '+iso+'</label></td><td><label class="radio inline"><input id="donation-option-3" name="donation-option" type="radio" value="'+amounts[2]+'">'+amounts[2]+' '+iso+'</label></td><td><label class="radio inline"><input id="donation-option-4" name="donation-option" type="radio" value="'+amounts[3]+'">'+amounts[3]+' '+iso+'</label></td><td><label class="radio inline"><input id="donation-option-5" name="donation-option" type="radio" value="'+amounts[4]+'">'+amounts[4]+' '+iso+'</label></td></table><table class="donation-payment"><td><div id="qrcode"><img src="http://placehold.it/170/ffffff/999999&text=Select amount" alt=""></div></td><td><p>Send <span class="span-amount">selected amount</span> to: <code><a href="'+currency+':'+address+'?label='+label+'" class="span-uri">'+address+'</a></code></p><br><p>Thank you for your support!</p></td></table></div><div class="modal-footer"><p class="powered-by">Powered by <a href="https://github.com/jeremymouton/cointipper" target="_blank">CoinTipper</a></p><a href="'+currency+':'+address+'?label='+label+'" class="span-uri btn btn-primary">Send with Wallet</a><a class="btn btn-default" data-dismiss="modal">Done</a></div></div></div></div>';
	} else {
		console.log('other');
		html = '<div id="'+currency+'-donation-overlay" class="modal fade '+currency+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">'+type+' to '+label+'</h4></div><div class="modal-body"><div class="well">'+type+' <input type="text" name="donation-amount" id="donation-amount" size="4" value=""> '+iso+' to <strong>'+label+'</strong>.</div><table class="donation-payment"><td><div id="qrcode"><img src="http://placehold.it/170/ffffff/999999&text=Select amount" alt=""></div></td><td><p>Send <span class="span-amount">selected amount</span> to: <code><a href="'+currency+':'+address+'?label='+label+'" class="span-uri">'+address+'</a></code></p><br><p>Thank you for your support!</p></td></table></div><div class="modal-footer"><p class="powered-by">Powered by <a href="https://github.com/jeremymouton/cointipper" target="_blank">CoinTipper</a></p><a href="'+currency+':'+address+'?label='+label+'" class="span-uri btn btn-primary">Send with Wallet</a><a class="btn btn-default" data-dismiss="modal">Done</a></div></div></div></div>';
	}
	
	return html;
}