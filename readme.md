# a

A think where I can see Chiang Mai's AQI. WIP.

## set up

```sh
$ yarn
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
$ nodemon server/index.js
```

open `http://localhost:4300`
