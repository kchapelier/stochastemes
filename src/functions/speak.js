"use strict";

var supported = !!window['speechSynthesis'] && !!window['SpeechSynthesisUtterance'],
    speak;

if (supported) {
    var synthesis = window.speechSynthesis,
        utterance = new window.SpeechSynthesisUtterance();

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
