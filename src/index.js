"use strict";

var dataCatalogue = require('./data-catalogue'),
    speak = require('./functions/speak');

var app = {
    init: function () {
        this.corpusElement = document.getElementsByClassName('corpus-catalogue')[0];
        this.corpusChoices = this.corpusElement.getElementsByTagName('li');
        this.generationElement = document.getElementsByClassName('generation-result')[0];
        this.speakerElement = document.getElementsByClassName('speaker')[0];

        this.selectedCorpus = null;
        this.running = true;
        this.voiced = speak.supported;

        this.setEvents();

        this.selectCorpus('baudelaire');
    },
    selectCorpus: function (id) {
        for (var i = 0; i < this.corpusChoices.length; i++) {
            this.corpusChoices[i].className = (this.corpusChoices[i].getAttribute('data-corpus-id') === id ? 'selected' : '');
        }

        var self = this;

        this.selectedCorpus = null;

        dataCatalogue.get(id, function (error, corpus) {
            self.selectedCorpus = corpus;
        });
    },
    next: function () {
        if (this.selectedCorpus) {
            var text = this.selectedCorpus.generate(this.selectedCorpus.minWidth + (Math.pow(Math.random(), 1.2) * (this.selectedCorpus.addWidth + 1)) | 0);

            if (this.voiced) {
                speak.speak(text, this.selectedCorpus.lang);
            }

            this.generationElement.innerHTML = text[0].toUpperCase() + text.substr(1);
        }
    },
    setEvents: function () {
        var self = this;

        if (speak.supported) {
            this.voiced = true;
            this.speakerElement.addEventListener('click', function (e) {
                self.voiced = !self.voiced;

                self.speakerElement.className = 'speaker' + (self.voiced ? '' : ' mute');
            });
        } else {
            this.voiced = false;
            this.speakerElement.style.display = 'none';
        }

        this.corpusElement.addEventListener('click', function (e) {
            var corpusId = e.target.getAttribute('data-corpus-id');

            if (corpusId) {
                self.selectCorpus(corpusId);
            }
        });

        setInterval(function () {
            if (self.running) {
                self.next();
            }
        }, 2500);

        this.observePageVisibility();
    },
    observePageVisibility: function () {
        var self = this;

        var visibilityChangeHandler = function visibilityChangeHandler () {
            if (!!document.hidden && self.running) {
                self.running = false;
            } else if (!document.hidden && !self.running) {
                self.running = true;
            }
        };

        document.addEventListener('visibilitychange', visibilityChangeHandler);
    }
};

module.exports = app;
