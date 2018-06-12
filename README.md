# browser-i18n

A simple in-browser i18n module, compatible with the [i18n-node](https://github.com/mashpie/i18n-node) server module data files. Meant to be use with a module bundler (like [parcel](https://parceljs.org)).

## Installation

By using npm:

```
npm i browser-i18n --save
```

## Usage

```javascript
import I18n from 'browser-i18n';

const i18n = new I18n({
    language: 'fr',
    path: '/locales',
    extension: '.json'
});

console.log( i18n.__('Hello') );
// Output: 'Bonjour'

console.log( i18n.__('Oh, hi %s!', 'Mark') );
// Output: 'Oh, salut Mark!'


// Or using the global selector ...

console.log( __('Hello') );
// Output: 'Bonjour'
```


### Files structures

One file for each language. They may have the following structure:

```json
// /locales/en.json

{
  "Hello": "Hello",
  "Oh, hi %s!": "Oh, hi %s!",
  "Bye!": "Bye!"
}
```
```json
// /locales/fr.json

{
  "Hello": "Bonjour",
  "Oh, hi %s!": "Oh, salut %s!",
  "Bye!": "Au revoir!"
}
```

Put your locales folder accessible publicly. You can do it by putting it in your public root:

```
.
└── public
    └── locales
        ├── en.json
        └── fr.json
```

Or, using express:

```javascript
app.use('/locales', express.static(path.join(__dirname, 'locales')));
```

## API

Configuration:

```javascript
const i18n = new I18n({
    language: 'fr',     // The langage wanted - Default 'en'
    path: '/locales',   // The path to access the locales files - Default '/locales'
    extension: '.json', // Local file extension - Default '.json'
    setGobal: true,     // Set the function '__' on a global scope - Default true
    onReady: callback,  // Set a callback triggered when the dataFile is loaded
    verbose: true       // Set the verbosity of the object - Default to true
});
```


