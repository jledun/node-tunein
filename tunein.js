"use strict";

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const BrowseHistory = new require('./browseHistory.js');

module.exports = class tunein {

  constructor() {
    this.reset();
  }

  reset() {
    // init browse history
    if ( this.histo ) {
      this.histo.reset();
    }else{
      this.histo = new BrowseHistory();
    }
    this.url = {};
    this.keys = [];
    this.url.filter = {};
    this.browseHistory = [];
    this.url.protocol = "http";
    this.url.host = "opml.radiotime.com";
    this.initSearch();
  }

  get() {
    return new Promise( (resolve, reject) => {
      // copy url of current element in browse history
      let tmpurl = JSON.parse( JSON.stringify( this.histo.getCurrent() ) );
      // stringify url
      tmpurl.search = querystring.stringify(tmpurl.search);
      // add filter if exists
      if ( this.filter ) tmpurl.search += `&${querystring.stringify(this.url.filter)}`;
      // get data from radiotime.com
      let req = http.get( url.format(tmpurl), (res) => {
        let tuneinRes = "";
        res.on('data', (chunk) => tuneinRes += chunk);
        res.on('end', () => { 
          let data = this.parseResult( JSON.parse( tuneinRes ) );
          return resolve( ( data ) ); 
        });
      });
      req.on('error', (err) => { return reject( err ); });
    });
  }

  parseURL( strUrl ) {
    let parsedurl = url.parse( strUrl );
    parsedurl.query = querystring.parse( parsedurl.query );
    return parsedurl;
  }

  parseResult( data ) {
    if ( data.head.status != 200 ) return new Error(`TuneIn Request error : ${data.head.fault}`);
    data.body.forEach( (elm) => {
      if ( typeof elm.URL != "undefined") {
        elm.URL = this.parseURL( elm.URL );
        // store main categories
        if ( typeof elm.URL.query != "undefined" && typeof elm.URL.query.c != undefined ) 
          if ( this.keys.indexOf( elm.key ) === -1 ) this.keys.push( elm.key );
      }
      if ( typeof elm.children != "undefined") {
        elm.children.forEach( (child) => {
          child.URL = this.parseURL( child.URL );
        });
      }
    });
    return data;
  }

  getKeys() {
    // return stored main categories
    return this.keys;
  }
  getBrowseHistory() {
    // return browse history
    return this.histo.content();
  }

  initSearch() {
    // set default to json instead of opml
    this.url.search = {render: "json"};
  }

  browsePrevious() {
    this.histo.previous();
    return this.get();
  }
  browseNext() {
    this.histo.next();
    return this.get();
  }

  browse( category, filter ) {
    // browse commands
    let cat = category || '';
    let fil = filter || '';
    this.url.pathname = "Browse.ashx";
    this.initSearch();
    if ( cat ) {
      if ( this.keys.indexOf( cat ) !== -1 ) {
        this.url.search.c = cat;
      }else{
        this.url.search.id = cat;
      }
    }
    if ( filter ) {
      this.url.filter = fil;
    }
    this.histo.add( this.url );
    return this.get();
  }

  search( chunk ) {
    // search in ratiotime repository
    this.url.pathname = "Search.ashx";
    this.initSearch();
    this.url.search.query = chunk;
    return this.get();
  }

}

