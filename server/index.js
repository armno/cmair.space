const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 4300;
const routes = require('./routes');
const gh = require('express-github-webhook');
const config = require('./config');
const exec = require('child_process').exec;

app.use('/api', routes);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const webhookHandler = gh({
  path: '/pull',
  secret: config.gh
});
app.use(webhookHandler);

webhookHandler.on('push', (repo, data) => {
  // run git pull
  exec(
    'cd /var/www/html/a.armno.xyz && git pull origin master && yarn',
    (error, stdout, stderror) => {
      if (error) {
        console.error(error);
      } else {
        console.info(stdout);
      }
    });
});

app.listen(port);
console.log('server is running at http://localhost:' + port);
