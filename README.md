# deep-for-each

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/deep-for-each
[downloads-image]:http://img.shields.io/npm/dm/deep-for-each.svg
[npm-image]:http://img.shields.io/npm/v/deep-for-each.svg
[travis-url]:https://travis-ci.org/IndigoUnited/js-deep-for-each
[travis-image]:http://img.shields.io/travis/IndigoUnited/js-deep-for-each/master.svg
[david-dm-url]:https://david-dm.org/IndigoUnited/js-deep-for-each
[david-dm-image]:https://img.shields.io/david/IndigoUnited/js-deep-for-each.svg
[david-dm-dev-url]:https://david-dm.org/IndigoUnited/js-deep-for-each#info=devDependencies
[david-dm-dev-image]:https://img.shields.io/david/dev/IndigoUnited/js-deep-for-each.svg

Recursively iterates over collections (arrays and objects). The iteration is made using a [deep-first](https://en.wikipedia.org/wiki/Depth-first_search) algorithm.


## Installation

`$ npm install deep-for-each` - `NPM`   
`$ bower install deep-for-each` - `bower`

The browser file is named `index.umd.js` which supports CommonJS, AMD and globals (`deepForEach`).
If you want to run this module on old browsers, you must include [es5-shim](https://github.com/es-shims/es5-shim).


## Usage

The example bellow is based on `nodejs`.

```js
var deepForEach = require('deep-for-each');

deepForEach({
    prop1: 'foo',
    prop2: ['foo', 'bar'],
    prop3: ['foo', 'foo'],
    prop4: {
        prop5: 'foo',
        prop6: 'bar'
    }
}, function (value, prop, subject, path) {
    // prop is an array index or an object key
    // subject is either an array or an object
    // path is the iteration path, e.g.: 'prop2[0]' and 'prop4.prop5'

    console.log(path + ':', value);
});
```

Running the example above will print:

```
prop1: foo
prop2: [ 'foo', 'bar' ]
prop2[0]: foo
prop2[1]: bar
prop3: [ 'foo', 'foo' ]
prop3[0]: foo
prop3[1]: foo
prop4: { prop5: 'foo', prop6: 'bar' }
prop4.prop5: foo
prop4.prop6: bar
```


## Tests

`$ npm test`


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
