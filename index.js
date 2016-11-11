"use strict";

const http = require('http');
const base_uri = "http://opml.radiotime.com/";
const search_uri = "Search.ashx?";

function get(uri) {
  return new Promise( (resolve, reject) => {
    if ( uri === "" ) return reject( new Error("url is empty"));
    let req = http.get( uri, (res) => {
      let strOpml = "";
      res.on('error', (err) => { return reject(err); });
      res.on('data', (chunk) => strOpml += chunk);
      res.on('end', () => { return resolve(strOpml); });
    });
    req.on('error', (err) => { return reject(err); });
  });
};

function browse() {
  get(base_uri)
  .then( (data) => console.log(data) )
  .catch( (err) => console.log(err) );
}

browse();
