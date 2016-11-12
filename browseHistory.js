"use strict";

const querystring = require('querystring');
const crypto = require('crypto');

module.exports = class BrowseHistory {

  constructor() {
    this.reset();
  }

  reset() {
    this.histo = [];
    this.index = -1;
  }
  
  add( url ) {
    this.histo.push({ 
      hash: crypto.createHash('md5').update(querystring.stringify( url.search )).digest('hex'),
      url: url,
      timestamp: Date.now()
    });
    this.index++;
  }

  getCurrent() {
    if ( this.index < 0 ) return {};
    return this.histo[ this.index ].url;
  }

};
