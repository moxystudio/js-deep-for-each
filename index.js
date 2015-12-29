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
    var deepPath;

    for (key in obj) {
        deepPath = path ? path + '.' + key : key;
        // Note that we always use obj[key] because it might be mutated by forEach
        fn.call(obj, obj[key], key, obj, deepPath);
        forEach(obj[key], fn, deepPath);
    }
}

function forEachArray(array, fn, path) {
    var deepPath = '';

    array.forEach(function (value, index, arr) {
        deepPath = path + '[' + index + ']';
        fn.call(arr, value, index, arr, deepPath);
        // Note that we use arr[index] because it might be mutated by forEach
        forEach(arr[index], fn, deepPath);
    });
}

module.exports = forEach;
