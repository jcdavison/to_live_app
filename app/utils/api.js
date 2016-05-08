// var SERVER = 'http://localhost:3000'
var SERVER = 'https://biocloud.herokuapp.com'

var api = {
  get(uri) {
    return fetch(`${SERVER}/api${uri}`)
    .then(res => res.json())
  },

  post(uri, body) {
    var url = `${SERVER}/api${uri}`
    console.log(body)
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'}
    return fetch(url, {method: "POST", headers: headers, body: body})
  }
};

module.exports = api;
