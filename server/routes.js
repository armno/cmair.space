const express = require('express');
const rp = require('request-promise');
const router = express.Router();
const config = require('./config');
const moment = require('moment-timezone');

const winston = require('winston');
winston.level = 'debug';
winston.add(winston.transports.File, {
	filename: './server/data.log'
});
winston.remove(winston.transports.Console);

router.get('/:station?', getAqiData);
module.exports = router;

function getAqiData(req, res) {
	const token = config.token;

	let station;
	if (req.params.station) {
		station = req.params.station;
	} else {
	 	station = '@6817'; // chiang mai, city hall
	}

	const url = `https://api.waqi.info/feed/${station}/?token=${token}`;

	rp({
			uri: url,
			json: true
		})
		.then(json => {
			if (json.data.aqi === '-') {
				res.json({
					aqi: '-',
					cityName: json.data.city.name,
					updatedAt: 'N/A'
				});
				return;
			}

			const updatedTime = moment.tz(`${json.data.time.s}${json.data.time.tz}`, 'Asia/Bangkok')
				.format('h:mmA, MMMM Do, YYYY');
			const data = {
				aqi: json.data.aqi,
				cityName: json.data.city.name,
				updatedAt: updatedTime
			};
			winston.log('debug', 'api data', data);
			res.json(data);
		});
}
