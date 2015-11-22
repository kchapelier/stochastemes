"use strict";

var generator = require('./functions/generator'),
    speak = require('./functions/speak'),
    get = require('./functions/get');

var dataCatalogue = {
    catalogue: {
        baudelaire: {
            file: './data/baudelaire.json',
            name: 'C.Baudelaire (Les Fleurs du Mal)',
            lang: 'fr-FR',
            generate: null
        },
        wordsworth: {
            file: './data/wordsworth.json',
            name: 'W.Wordsworth (The Excursion)',
            lang: 'en-GB',
            generate: null
        },
        shelley: {
            file: './data/shelley.json',
            name: 'P.B.Shelley (selected poems)',
            lang: 'en-GB',
            generate: null
        },
        leopardi: {
            file: './data/leopardi.json',
            name: 'G.Leopardi (Appressamento Della Morte)',
            lang: 'it-IT',
            generate: null
        },
        goethe: {
            file: './data/goethe.json',
            name: 'J.W. von Goethe (selected poems)',
            lang: 'de-DE',
            generate: null
        }
    },
    get: function (id, callback) {
        var self = this;

        if (!this.catalogue.hasOwnProperty(id)) {
            callback(new Error('Catalogue : unknown id "' + id + '"'), null);
        } else if (this.catalogue[id].generate === null) {
            get(this.catalogue[id].file, function intermediateCallback (error, text) {
                if (error) {
                    callback(error, self.catalogue[id]);
                } else {
                    self.catalogue[id].generate = generator(JSON.parse(text));
                    callback(null, self.catalogue[id]);
                }
            });
        } else {
            callback(null, this.catalogue[id]);
        }
    }
};

var app = {
    init: function () {
        //speak.speak('on va poucho ce soir !', 'fr-FR');

        this.corpusElement = document.getElementsByClassName('corpus-catalogue')[0];
        this.corpusChoices = this.corpusElement.getElementsByTagName('li');
        this.generationElement = document.getElementsByClassName('generation-result')[0];
        this.speakerElement = document.getElementsByClassName('speaker')[0];

        this.selectedCorpus = null;
        this.voiced = true;
        this.running = true;

        var self = this;

        this.speakerElement.addEventListener('click', function (e) {
            self.voiced = !self.voiced;

            self.speakerElement.className = 'speaker' + (self.voiced ? '' : ' mute');
        });

        this.corpusElement.addEventListener('click', function (e) {
            var corpusId = e.target.getAttribute('data-corpus-id');

            if (corpusId) {
                self.selectCorpus(corpusId);
            }
        });

        this.selectCorpus('baudelaire');

        setInterval(function () {
            if (self.running) {
                self.next();
            }
        }, 2500);

        this.observePageVisibility();
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
            var text = this.selectedCorpus.generate(7 + (Math.pow(Math.random(), 1.2) * 6) | 0);

            if (this.voiced) {
                speak.speak(text, this.selectedCorpus.lang);
            }

            this.generationElement.innerHTML = text[0].toUpperCase() + text.substr(1);
        }
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
