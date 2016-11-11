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
    if (this.histo) {
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
      let tmpurl = JSON.parse( JSON.stringify( this.histo.getCurrent() ) );
      tmpurl.search = querystring.stringify(tmpurl.search);
      if ( this.filter ) tmpurl.search += `&${querystring.stringify(this.url.filter)}`;
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

  parseResult( data ) {
    if ( data.head.status != 200 ) return new Error(`TuneIn Request error : ${data.head.fault}`);
    switch (data.head.title) {
      case "Browse":
        data.body.forEach( (elm) => {
          if ( this.keys.indexOf( elm.key ) === -1 ) this.keys.push( elm.key );
        });
        break;

      default:
        data.body.forEach( (elm) => {
          if ( typeof elm.children != "undefined") elm.children = JSON.stringify(elm.children);
        });
        break;
    }
    return data;
  }

  getRoot() {
    return this.elements;
  }

  initSearch() {
    this.url.search = {render: "json"};
  }

  browse( category, filter ) {
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
    this.url.pathname = "Search.ashx";
    this.initSearch();
    this.url.search.query = chunk;
    return this.get();
  }

}

