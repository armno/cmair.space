const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 4300;
const routes = require('./routes');
const gh = requrie('express-github-webhook');
const config = require('./config');

app.use(cors());
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
console.log('server running on port ' + port);
