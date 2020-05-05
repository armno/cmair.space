import { NowRequest, NowResponse } from '@now/node';
import fetch from 'isomorphic-unfetch';

export default async (req: NowRequest, res: NowResponse) => {
	const station = req.query.station || '@6817';

	try {
		const TOKEN = process.env.TOKEN;
		const url = `https://api.waqi.info/feed/${station}/?token=${TOKEN}`;

		const response = await fetch(url, {
			method: 'GET',
		});

		const body = await response.json();
		if (body.data.jaqi === '-') {
			return res.json({
				aqi: -1,
				cityName: body.data.city.name,
				updatedAt: 'N/A',
			});
		}

		return res.status(200).json({
			aqi: body.data.aqi,
			cityName: body.data.city.name,
			updatedAt: `${body.data.time.s}${body.data.time.tz}`,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message || error.toString(),
		});
	}
};
