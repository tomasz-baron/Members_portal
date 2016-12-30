angular.module('main.changeItems', [])
.factory('changeItems', function() {
    var items = {};
    
    var add = function(item) {
        if (!items[item.type]) {
            items[item.type] = []; 
        } 
        items[item.type].push(item);
    };

    var addAll = function(list) {
        for (var i = 0, len = list.length; i < len; i++) {
            add(list[i]);
        }
    };

    var get = function(type) {
        return items[type];
    };
    
    var getAll = function() {
        return items;
    };

	return {
            addAll: addAll,
            get: get,
            getAll: getAll
        };
});
