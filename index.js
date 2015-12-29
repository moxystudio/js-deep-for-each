'use strict';

var isPlainObject = require('is-plain-object');

function deepForEach(value, fn) {
    forEach(value, fn, '');
}

function forEach(value, fn, path) {
    if (Array.isArray(value)) {
        forEachArray(value, fn, path);
    } else if (isPlainObject(value)) {
        forEachObject(value, fn, path);
    }
}

function forEachObject(obj, fn, path) {
    var key;
    var value;
    var deepPath;

    for (key in obj) {
        value = obj[key];
        deepPath = path ? path + '.' + key : key;
        fn.call(obj, value, key, obj, deepPath);
        forEach(value, fn, deepPath);
    }
}

function forEachArray(array, fn, path) {
    var filtered = [];
    var deepPath = '';

    array.forEach(function (value, index, array) {
        deepPath = path + '[' + index + ']';
        fn.call(array, value, index, array, deepPath);
        forEach(value, fn, deepPath);
    });
}

module.exports = deepForEach;
