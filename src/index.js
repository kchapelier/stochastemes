"use strict";

var dataCatalogue = require('./data-catalogue'),
    speak = require('./functions/speak');

var iOS = /iPad|iPhone|iPod/.test(navigator.platform);

var app = {
    init: function () {
        this.startButtonElement = document.getElementsByClassName('start-button')[0];
        this.mainElement = document.getElementsByClassName('main')[0];
        this.corpusElement = document.getElementsByClassName('corpus-catalogue')[0];
        this.corpusChoices = this.corpusElement.getElementsByTagName('li');
        this.generationElement = document.getElementsByClassName('generation-result')[0];
        this.speakerElement = document.getElementsByClassName('speaker')[0];

        this.selectedCorpus = null;
        this.running = true;
        this.voiced = speak.supported;

        if (iOS) {
            this.displayStartButton();
        } else {
            this.displayMain();
            this.start();
        }

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
    start: function () {
        var self = this;
        setInterval(function () {
            if (self.running) {
                self.next();
            }
        }, 2500);
    },
    displayStartButton: function () {
        this.startButtonElement.style.display = 'block';
        this.mainElement.style.display = 'none';
    },
    displayMain: function () {
        this.startButtonElement.style.display = 'none';
        this.mainElement.style.display = 'block';
    },
    setEvents: function () {
        var self = this;

        if (speak.supported) {
            this.speakerElement.addEventListener('click', function (e) {
                e.preventDefault();

                self.voiced = !self.voiced;

                self.speakerElement.className = 'speaker' + (self.voiced ? '' : ' mute');
            });
        } else {
            this.speakerElement.style.display = 'none';
        }

        this.corpusElement.addEventListener('click', function (e) {
            var corpusId = e.target.getAttribute('data-corpus-id');

            if (corpusId) {
                self.selectCorpus(corpusId);
            }
        });

        this.startButtonElement.addEventListener('click', function(e) {
            e.preventDefault();

            speak.speak(' ', 'fr-FR'); // hack for safari being dumb

            self.displayMain();
            self.start();
        });

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
