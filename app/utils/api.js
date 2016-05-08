var SERVER = 'http://localhost:3000'
// var SERVER = 'https://biocloud.herokuapp.com'

var api = {
    get(uri) {
        return fetch(`${SERVER}/api${uri}`)
                    .then(res => res.json())
    },

    post(uri, data) {
        console.log('post data', data)
        var url = `${SERVER}/api${uri}`
        var body = `bioEvent[info]=${data.info}&bioEvent[imageData]=${data.imageData}`
        return null
        // return fetch(url, {method: 'post', body })
        //     .then((res) => res.json() );
    }
};

module.exports = api;
