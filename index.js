var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //.split('').reverse().join('')
var length = 6;
var encode = function (n, l) {
    return shift(pad(baseX(n), l));
};
var decode = function (n) {
};
var pad = function (n, l) {
    return (n.length >= l) ? n : pad(dict[0] + n, l);
};
var unpad = function (n) {
    var regex = new RegExp("^".concat(dict[0], "+"));
    return n.replace(regex, '');
};
var baseX = function (n) {
    var div = Math.floor(n / dict.length);
    var rem = n % dict.length;
    return (div > 0) ? baseX(div) + dict[rem] : dict[rem];
};
var base10 = function (n) {
    return n.split('').reverse().map(function (c, i) {
        console.log((dict.length) ^ i);
        return dict.indexOf(c) * (dict.length) ^ i;
    });
};
var shift = function (n) {
    return n.split('').map(function (c, i) {
        var loc = (dict.indexOf(c) + i);
        return dict[loc % dict.length];
    }).join('');
};
var unshift = function (n) {
    return n.split('').map(function (c, i) {
        var loc = (dict.indexOf(c) - i + dict.length);
        return dict[loc % dict.length];
    }).join('');
};
var reverse = function (str) {
    return str.split('').reverse().join('');
};
__spreadArray([], Array(1000).keys(), true).map(function (num) { return console.log("".concat(num, " > ").concat(baseX(num), " > ").concat(pad(baseX(num), length), " > ").concat(encode(num, length), "  > ").concat(unshift(encode(num, length)), "  > ").concat(unpad(unshift(encode(num, length))))); });
var num = 3000000000;
console.log("".concat(num, " -> ").concat(encode(num, length)));
console.log(base10('R8'));
