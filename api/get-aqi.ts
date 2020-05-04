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

		return res.status(200).json(body.data);
	} catch (error) {
		return res.status(500).json({
			error: error.message || error.toString(),
		});
	}
};
