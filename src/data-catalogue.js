"use strict";

var generator = require('./functions/generator'),
    get = require('./functions/get');

var dataCatalogue = {
    catalogue: {
        baudelaire: {
            file: './data/baudelaire.json?v=2',
            name: 'C.Baudelaire (Les Fleurs du Mal)',
            lang: 'fr-FR',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        wordsworth: {
            file: './data/wordsworth.json?v=2',
            name: 'W.Wordsworth (The Excursion)',
            lang: 'en-GB',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        shelley: {
            file: './data/shelley.json?v=2',
            name: 'P.B.Shelley (selected poems)',
            lang: 'en-GB',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        leopardi: {
            file: './data/leopardi.json?v=2',
            name: 'G.Leopardi (Appressamento Della Morte)',
            lang: 'it-IT',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        goethe: {
            file: './data/goethe.json?v=2',
            name: 'J.W. von Goethe (selected poems)',
            lang: 'de-DE',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        hugo: {
            file: './data/hugo.json?v=2',
            name: 'V. Hugo (extracts from La Légende des Siècles)',
            lang: 'fr-FR',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        decastro: {
            file: './data/decastro.json?v=2',
            name: 'R. de Castro (selected poems)',
            lang: 'es-ES',
            generate: null,
            minWidth: 7,
            addWidth: 5
        },
        wakaandhaiku: {
            file: './data/wakaandhaiku.json?v=2',
            name: 'Various (selected waka and haiku poems)',
            lang: 'ja-JP',
            generate: null,
            minWidth: 6,
            addWidth: 3
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
