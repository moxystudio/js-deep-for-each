'use strict';

var expect = require('expect.js');
var isPlainObject = require('is-plain-object');
var cloneDeep = require('lodash.clonedeep');
var forEach = require('../');

var analyzed;

function analyze(value, prop, subject, path) {
    /* eslint no-invalid-this:0 */
    if (!Array.isArray(subject) && !isPlainObject(subject)) {
        throw new Error('Expect subject to be an array or an object');
    }
    if (typeof prop !== 'string' && typeof prop !== 'number') {
        throw new Error('Expect prop to be a string or a number');
    }
    expect(this).to.be(subject);

    analyzed.push({
        value: value,
        prop: prop,
        path: path,
    });
}


function assertAnalyzed(expected) {
    expect(analyzed).to.eql(expected);
    analyzed = [];
}

describe('deep-for-each', function () {
    beforeEach(function () {
        analyzed = [];
    });

    it('should not call fn on primitive input', function () {
        forEach(undefined, analyze);
        assertAnalyzed([]);

        forEach(null, analyze);
        assertAnalyzed([]);

        forEach('  ', analyze);
        assertAnalyzed([]);

        forEach('', analyze);
        assertAnalyzed([]);

        forEach(true, analyze);
        assertAnalyzed([]);
    });

    it('should iterate object entries recursively', function () {
        forEach({ foo: null }, analyze);
        assertAnalyzed([{
            value: null,
            prop: 'foo',
            path: 'foo',
        }]);

        forEach({ foo: undefined }, analyze);
        assertAnalyzed([{
            value: undefined,
            prop: 'foo',
            path: 'foo',
        }]);

        forEach({ foo: { bar: null } }, analyze);
        assertAnalyzed([{
            value: { bar: null },
            prop: 'foo',
            path: 'foo',
        }, {
            value: null,
            prop: 'bar',
            path: 'foo.bar',
        }]);

        forEach({ foo: { bar: undefined } }, analyze);
        assertAnalyzed([{
            value: { bar: undefined },
            prop: 'foo',
            path: 'foo',
        }, {
            value: undefined,
            prop: 'bar',
            path: 'foo.bar',
        }]);

        forEach({ foo: { bar: null, baz: 1, bay: '  ' } }, analyze);
        assertAnalyzed([{
            value: { bar: null, baz: 1, bay: '  ' },
            prop: 'foo',
            path: 'foo',
        }, {
            value: null,
            prop: 'bar',
            path: 'foo.bar',
        }, {
            value: 1,
            prop: 'baz',
            path: 'foo.baz',
        }, {
            value: '  ',
            prop: 'bay',
            path: 'foo.bay',
        }]);
    });

    it('should iterate arrays recursively', function () {
        forEach([null], analyze);
        assertAnalyzed([{
            value: null,
            prop: 0,
            path: '[0]',
        }]);

        forEach([undefined], analyze);
        assertAnalyzed([{
            value: undefined,
            prop: 0,
            path: '[0]',
        }]);

        forEach([1, ['foo', '', null, '  ']], analyze);
        assertAnalyzed([{
            value: 1,
            prop: 0,
            path: '[0]',
        }, {
            value: ['foo', '', null, '  '],
            prop: 1,
            path: '[1]',
        }, {
            value: 'foo',
            prop: 0,
            path: '[1][0]',
        }, {
            value: '',
            prop: 1,
            path: '[1][1]',
        }, {
            value: null,
            prop: 2,
            path: '[1][2]',
        }, {
            value: '  ',
            prop: 3,
            path: '[1][3]',
        }]);
    });

    it('should iterate array/objects recursively', function () {
        forEach({
            something: [
                {
                    colors: ['red', ' green ', ''],
                    cars: { audi: 'nice', vw: 'good', aston: '' },
                },
                undefined,
                '',
            ],
            foo: 'bar',
        }, analyze);

        assertAnalyzed([{
            value: [
                {
                    colors: ['red', ' green ', ''],
                    cars: { audi: 'nice', vw: 'good', aston: '' },
                },
                undefined,
                '',
            ],
            prop: 'something',
            path: 'something',
        }, {
            value: {
                colors: ['red', ' green ', ''],
                cars: { audi: 'nice', vw: 'good', aston: '' },
            },
            prop: 0,
            path: 'something[0]',
        }, {
            value: ['red', ' green ', ''],
            prop: 'colors',
            path: 'something[0].colors',
        }, {
            value: 'red',
            prop: 0,
            path: 'something[0].colors[0]',
        }, {
            value: ' green ',
            prop: 1,
            path: 'something[0].colors[1]',
        }, {
            value: '',
            prop: 2,
            path: 'something[0].colors[2]',
        }, {
            value: { audi: 'nice', vw: 'good', aston: '' },
            prop: 'cars',
            path: 'something[0].cars',
        }, {
            value: 'nice',
            prop: 'audi',
            path: 'something[0].cars.audi',
        }, {
            value: 'good',
            prop: 'vw',
            path: 'something[0].cars.vw',
        }, {
            value: '',
            prop: 'aston',
            path: 'something[0].cars.aston',
        }, {
            value: undefined,
            prop: 1,
            path: 'something[1]',
        }, {
            value: '',
            prop: 2,
            path: 'something[2]',
        }, {
            value: 'bar',
            prop: 'foo',
            path: 'foo',
        }]);
    });

    it('should use the up to date value (in case the forEach callback modified it)', function () {
        forEach({
            arr: [[1, { foo: 'bar' }]],
            foo: { bar: 'baz' },
        }, function (value, prop, subject, path) {
            if (path === 'arr[0]') {
                subject[prop] = [1, {}];
            } else if (path === 'foo') {
                subject[prop] = 'bar';
            }

            analyze.call(this, cloneDeep(value), prop, subject, path);
        });

        assertAnalyzed([{
            value: [[1, { foo: 'bar' }]],
            prop: 'arr',
            path: 'arr',
        }, {
            value: [1, { foo: 'bar' }],
            prop: 0,
            path: 'arr[0]',
        }, {
            value: 1,
            prop: 0,
            path: 'arr[0][0]',
        }, {
            value: {},
            prop: 1,
            path: 'arr[0][1]',
        }, {
            value: { bar: 'baz' },
            prop: 'foo',
            path: 'foo',
        }]);
    });
});
