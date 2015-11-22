"use strict";

var generator = require('./functions/generator'),
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
        },
        hugo: {
            file: './data/hugo.json',
            name: 'V. Hugo (extracts from La Légende des Siècles)',
            lang: 'fr-FR',
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

module.exports = dataCatalogue;
