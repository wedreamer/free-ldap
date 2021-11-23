"use strict";
var target = {
    a: 1,
    b: function () {
        console.log(1234);
    },
};
var proxy = new Proxy(target, {
    set: function (target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    },
    get: function (target, key, receiver) {
        return target[key] instanceof Function
            ? function (...args) {
                console.log('before');
                target[key](args);
                console.log('after');
            }
            : target[key];
    },
});
proxy.b();
// proxy.a = 123;
//# sourceMappingURL=test.js.map