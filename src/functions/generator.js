"use strict";

// should soon have its own npm module, when the cli command is ready

var selectRandom = function selectRandom (list, rng) {
    var select = rng(),
        keys = Object.keys(list),
        key,
        i;

    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        select -= list[key];

        if (select <= 0) {
            return key;
        }
    }
};

var makeGenerator = function makeGenerator (description, rng) {
    var rng = rng || Math.random,
        config = description.config,
        data = description.data,
        ngram;

    return function generator (lengthHint) {
        var result = ngram = selectRandom(data.fe, rng),
            ngramData = data.e[ngram],
            loop = ngramData.hc || ngramData.hlc;

        while (loop) {
            if (
                (lengthHint <= result.length && ngramData.hlc) ||
                (!ngramData.hc)
            ) {
                ngram = selectRandom(ngramData.lc, rng); //lastChildren
                result += ngram.substr(-1);
                loop = false;
            } else {
                ngram = selectRandom(ngramData.c, rng); //children
                ngramData = data.e[ngram];
                result += ngram.substr(-1);
            }
        }

        return result;
    };
};

module.exports = makeGenerator;
