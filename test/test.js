import forEach from '../src';

const iterator = jest.fn(() => {});

afterEach(jest.resetAllMocks);

function takeSnapshot() {
    expect(iterator.mock.calls).toMatchSnapshot();
    jest.resetAllMocks();
}

it('should not call fn on primitive input', () => {
    forEach(undefined, iterator);
    expect(iterator).toHaveBeenCalledTimes(0);

    forEach(null, iterator);
    expect(iterator).toHaveBeenCalledTimes(0);

    forEach('  ', iterator);
    expect(iterator).toHaveBeenCalledTimes(0);

    forEach('', iterator);
    expect(iterator).toHaveBeenCalledTimes(0);

    forEach(true, iterator);
    expect(iterator).toHaveBeenCalledTimes(0);
});

it('should iterate object entries recursively', () => {
    forEach({ foo: null }, iterator);
    takeSnapshot();

    forEach({ foo: undefined }, iterator);
    takeSnapshot();

    forEach({ foo: { bar: null } }, iterator);
    takeSnapshot();

    forEach({ foo: { bar: undefined } }, iterator);
    takeSnapshot();

    forEach({ foo: { bar: null, baz: 1, bez: '  ' } }, iterator);
    takeSnapshot();
});

it('should iterate arrays recursively', () => {
    forEach([null], iterator);
    takeSnapshot();

    forEach([undefined], iterator);
    takeSnapshot();

    forEach([1, ['foo', '', null, '  ']], iterator);
    takeSnapshot();
});

it('should iterate array/objects recursively', () => {
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
    }, iterator);
    takeSnapshot();
});

it('should use the up to date value (in case the forEach callback modified it)', () => {
    forEach({
        arr: [[1, { foo: 'bar' }]],
        foo: { bar: 'baz' },
    }, (value, prop, subject, path) => {
        if (path === 'arr[0]') {
            subject[prop] = [1, {}];
        } else if (path === 'foo') {
            subject[prop] = 'bar';
        }

        iterator(value, prop, subject, path);
    });

    takeSnapshot();
});

it('should make `this` equal to the subject on the iterator', () => {
    const obj = { foo: 'bar' };

    expect.assertions(2);

    forEach(obj, function (value, prop, subject) {
        expect(subject).toBe(obj);
        expect(this).toBe(subject); // eslint-disable-line no-invalid-this
    });
});
