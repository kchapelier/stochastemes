"use strict";

var supported = !!window['speechSynthesis'] && !!window['SpeechSynthesisUtterance'],
    speak;

if (supported) {
    var synthesis = window.speechSynthesis,
        utterance = new window.SpeechSynthesisUtterance();

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.9;

    speak = function speak (msg, lang) {
        utterance.lang = lang;
        utterance.text = msg;
        synthesis.speak(utterance);
    };
} else {
    speak = function noop () {};
}

module.exports = {
    supported: supported,
    speak: speak
};
