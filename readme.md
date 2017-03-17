# a

A think where I can see Chiang Mai's AQI. WIP.

## set up

```sh
$ yarn
```

create `server/config.js` file with aqicn.org API token

```js
const config = {
	token: '<YOUR_TOKEN>'
};
module.exports = config;
```

start local server with `nodemon`

```sh
$ nodemon server/index.js
```

open `http://localhost:4300`
