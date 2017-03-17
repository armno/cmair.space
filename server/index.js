const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 4300;
const routes = require('./routes');

app.use(cors());
app.use('/api', routes);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.listen(port);
console.log('server running on port ' + port);
