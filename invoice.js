angular.module('invoiceApp', [])

.controller('InvoiceController', function($scope) {

	$scope.invoice = {
		number: '',
		date: null,
		paydate: null,
		sum: null
	}

	$scope.details = [{ amount: 1, vat: 23 }];


	$scope.addDetail = function() {
		$scope.details.push({ amount: 1, vat: 23 });
	};

	$scope.removeDetail = function(index) {
		if($scope.details.length > 1) {
			$scope.details.splice(index, 1);
		}
		calcTotalSum($scope.details);	
	};

	$scope.calc = function(detail) {
		var brutto = parseFloat(detail.netto) + (parseFloat(detail.netto) * parseInt(detail.vat) / 100);
		detail.brutto = isNaN(brutto) ? '0.00' : brutto.toFixed(2);
		var sumbr = parseFloat(brutto) * parseInt(detail.amount);
		detail.sumbr = isNaN(sumbr) ? '0.00' : sumbr.toFixed(2);
		calcTotalSum($scope.details);
	};

	calcTotalSum = function(details) {
		var sum = details.reduce(function(sum, detail) {
			return sum + isNaN(parseFloat(detail.sumbr)) ? 0 : parseFloat(detail.sumbr);
		}, 0);
		$scope.invoice.sum = sum.toFixed(2);
	};
});
