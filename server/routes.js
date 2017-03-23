const express = require('express');
const rp = require('request-promise');
const router = express.Router();
const config = require('./config');
const moment = require('moment');

const winston = require('winston');
winston.level = 'debug';
winston.add(winston.transports.File, {
	filename: './server/data.log'
});
winston.remove(winston.transports.Console);

router.get('/', getAqiData);
module.exports = router;

function getAqiData(req, res) {
	const token = config.token;
	// @6817 - city hall
	// @1822 - yupparaj
	// @9471 - chiang mai gaia station 04
	const station = '@6817';
	const url = `https://api.waqi.info/feed/${station}/?token=${token}`;

	rp({
			uri: url,
			json: true
		})
		.then(json => {
			const updatedTime = moment(`${json.data.time.s}${json.data.time.tz}`).fromNow();
			const data = {
				aqi: json.data.aqi,
				level: getAqiLevel(json.data.aqi),
				cityName: json.data.city.name,
				updatedAt: updatedTime
			};
			winston.log('debug', 'api data', data);
			res.json(data);
		});
}


function getAqiLevel(index) {
	if (index >= 300) {
		return 'HAZARDOUS';
	}

	if (index >= 201) {
		return 'VERY-UNHEALTHY';
	}

	if (index >= 151) {
		return 'UNHEALTHY';
	}

	if (index >= 101) {
		return 'UNHEALTHY-SENSITIVE';
	}

	if (index >= 51) {
		return 'MODERATE';
	}

	return 'GOOD';
}
