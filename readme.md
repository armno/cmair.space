# cmair.space

Displaying Chiang Mai's AQI using data from [aqicn.org](http://aqicn.org)

## set up

```sh
$ npm install
```

create `server/config.js` file with aqicn.org API token. `gh` is the webhook secret key (i use webhook to auto-deploy).

```js
const config = {
  token: 'aqicn.org api token',
  gh: 'github webhook secret'
};
module.exports = config;
```

start local server with `nodemon`

```sh
$ npm start
```

open `http://localhost:4300`
