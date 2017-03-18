const express = require('express');
const rp = require('request-promise');
const router = express.Router();
const config = require('./config');
const moment = require('moment');

router.get('/', getAqiData);
module.exports = router;

function getAqiData(req, res) {
	const token = config.token;
	const url = `https://api.waqi.info/feed/@6817/?token=${token}`;

	rp({
			uri: url,
			json: true
		})
		.then(json => {
			const updatedTime = moment(`${json.data.time.s}${json.data.time.tz}`).fromNow();
			res.json({
				aqi: json.data.aqi,
				level: getAqiLevel(json.data.aqi),
				cityName: json.data.city.name,
				updatedAt: updatedTime
			});
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
