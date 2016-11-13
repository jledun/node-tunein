"use strict";

const querystring = require('querystring');
const crypto = require('crypto');

module.exports = class BrowseHistory {

  constructor() {
    this.reset();
  }

  reset() {
    // init 
    this.histo = [];
    this.index = -1;
  }

  indexOf( hash ) {
    if ( this.histo.length == 0 ) return -1;
    let i;
    let retval = -1;
    for ( i = 0; i < this.histo.length; i++ ) {
      if ( this.histo[i].hash === hash ) {
        retval = i;
        break;
      }
    }
    return retval;
  }
  
  add( url ) {
    // make sure that added url is not already the last element
    let hash = crypto.createHash('md5').update(querystring.stringify( url.search )).digest('hex');
    // check already existing element in browse history
    // then set index to found item
    let tmp = this.indexOf( hash );
    if ( tmp > -1 ) {
      this.index = tmp;
      return;
    }
    // make sure that we always push at last index (after a previous call, for example)
    while( this.index > -1 && this.index < this.histo.length - 1 ) this.histo.pop();
    this.histo.push({ 
      hash: hash,
      url: url,
      timestamp: Date.now()
    });
    this.index++;
  }

  previous() {
    // get previous value in browse history
    if ( this.index > 0 ) this.index--;
    return this.getCurrent();
  }
  next() {
    // get next value in browse history
    if ( this.index < this.histo.length -1 ) this.index++;
    return this.getCurrent();
  }

  getCurrent() {
    if ( this.index < 0 ) return {};
    console.log(this.histo);
    console.log(this.index);
    return this.histo[ this.index ].url;
  }

  content() {
    return this.histo;
  }

};
