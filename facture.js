var $ = jQuery.noConflict();

$(document).ready(function() {
	bindEvents();

	$('#add-button').on('click', addRow);
	$('#delete-button').on('click', deleteRow);
});

function bindEvents() {
	$('input[name=facture\\.details\\.amount]').on('change keyup', calculateSumaBrutto);
	$('input[name=facture\\.details\\.netto]').on('change keyup', calculateBrutto);
	$('select[name=facture\\.details\\.vat]').on('change', calculateBrutto);

	$('input[name=facture\\.details\\.brutto]').on('change', calculateSumaBrutto);
	$('input[name=facture\\.details\\.sumbr]').on('change', calculateSumaTotal);
}

function calculateBrutto(e) {
	var nettoElem = $(this).parents('tr').find('input[name=facture\\.details\\.netto]');
	var bruttoElem = $(this).parents('tr').find('input[name=facture\\.details\\.brutto]');
	var vatElem = $(this).parents('tr').find('select[name=facture\\.details\\.vat] ');
	var netto = parseFloat(nettoElem.val());
	var vat = parseFloat(vatElem.val());
	var brutto = (netto * vat / 100) + netto;
	if(isNaN(brutto)) {
		bruttoElem.val();
	} else {
		bruttoElem.val(brutto.toFixed(2));
	}	

	bruttoElem.trigger('change');
}

function calculateSumaBrutto(e) {
	var nettoElem = $(this).parents('tr').find('input[name=facture\\.details\\.netto]');
	var vatElem = $(this).parents('tr').find('select[name=facture\\.details\\.vat] ');
	var sumaBruttoElem = $(this).parents('tr').find('input[name=facture\\.details\\.sumbr]');
	var amountElem = $(this).parents('tr').find('input[name=facture\\.details\\.amount]');
	var amount = parseInt(amountElem.val());
	var netto = parseFloat(nettoElem.val());
	var vat = parseFloat(vatElem.val());
	var brutto = (netto * vat / 100) + netto;
	var sumaBrutto = brutto * amount;
	if(isNaN(sumaBrutto)) {
		sumaBruttoElem.val();
	} else {
		sumaBruttoElem.val(sumaBrutto.toFixed(2));
	}
	
	sumaBruttoElem.trigger('change');
}

function calculateSumaTotal(e) {
	var sumaBruttoElems = $('input[name=facture\\.details\\.sumbr]');
	var totalSumElem = $('input#facture\\.sum');

	var totalSum = $.map(sumaBruttoElems, function(elem, i) {
		return parseFloat($(elem).val());
	}).reduce(function(a, b) {
		return a + b;
	});

	if(isNaN(totalSum)) {
		totalSumElem.val();
	} else {
		totalSumElem.val(totalSum.toFixed(2));
	}
}

function addRow() {
	var lastRow = $('table#facture-details tbody tr:last');
	var factureDetails = $('table#facture-details tbody');

	factureDetails.append(lastRow.clone());

	var addedRow = $('table#facture-details tbody tr:last');
	var lp = addedRow.prevAll('tr').length;
	lp++;
	addedRow.find('td:first').html(lp + '.');
	clearRow(addedRow);
	bindEvents();
}

function clearRow(row) {
	row.find('input[name=facture\\.details\\.amount]').val('1');
	row.find('input[name=facture\\.details\\.netto]').val('');
	row.find('input[name=facture\\.details\\.vat]').val('');
	row.find('input[name=facture\\.details\\.brutto]').val('');
	row.find('input[name=facture\\.details\\.sumbr]').val('');
}

function deleteRow() {
	var lastRow = $('table#facture-details tbody tr:last');
	if($('table#facture-details tbody tr').length > 1) {
		lastRow.remove();
		var totalSumElem = $('input#facture\\.sum');
		calculateSumaTotal();
		bindEvents();
	} else {
		clearRow(lastRow);
	}
}