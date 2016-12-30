angular.module('main.paymentItems', [])
.factory('paymentItems', function() {

  var items = {};

  var add = function(item) {
    items[item.id] = item;
  };

  var remove = function(item) {
    delete items[item];
  };

  var get = function() {
    return items;
  };

	return {
    get: get,
    add: add,
    remove: remove
	};
});
