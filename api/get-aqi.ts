import { NowRequest, NowResponse } from '@now/node';
import fetch from 'isomorphic-unfetch';

export default async (req: NowRequest, res: NowResponse) => {
	const station = req.query.station || '@6817';

	try {
		const TOKEN = process.env.TOKEN;
		const url = `https://api.waqi.info/feed/${station}/?token=${TOKEN}`;

		const response = await fetch(url);

		if (response.status >= 400) {
			return res.status(400).json({
				error: `cannot get aqi data`,
			});
		}

		return res.status(200).json(response);
	} catch (error) {
		return res.status(500).json({
			error: error.message || error.toString(),
		});
	}
};
