# tunein.js
A wrapper to search and browse TuneIn web radios library.

Based on what I've read in the Python [mopidy TuneIn module](https://github.com/kingosticks/mopidy-tunein.git) and a basic request to [radiotime.com](http://opml.radiotime.com).

I've Googled and DuckDucked a lot but couldn't find any docs about opml.radiotime.com specifications so the functions provided by this module are quite simple.

This project needs a lot of improvements and completed with tests, doc, ...
# Install
```
npm install --save node-tunein
```
This projects is developped and tested with nodejs-v7.1.0
# Usage
```javascript
"use strict";

let TuneIn = require('node-tunein');
let tunein = new TuneIn();
tunein.browse()
.then( (data) => console.log(data) )
.catch( (err) => console.log(err) );
```
# What does this module provide ?
The module provides ability to a client to :

* browse radiotime.com library
* search in radiotime.com library

All returned URLs are parsed with url and querystring native modules of NodeJS.

Returned objects are list of categories and/or webradios, client needs to parse objects to know what to do with :(

Returned objects can have children (an array of library elements)
# Licence
The MIT License (MIT)
Copyright (c) 2016 Julien Ledun <j.ledun@iosystems.fr>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
