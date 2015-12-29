'use strict';

var isPlainObject = require('is-plain-object');

function forEach(value, fn, path) {
    path = path || '';

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
    var deepPath = '';

    array.forEach(function (value, index, arr) {
        deepPath = path + '[' + index + ']';
        fn.call(arr, value, index, arr, deepPath);
        forEach(value, fn, deepPath);
    });
}

module.exports = forEach;
