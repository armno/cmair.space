import { NowRequest, NowResponse } from '@vercel/node';
import fetch from 'isomorphic-unfetch';

interface AQIData {
  aqi: number;
  cityName: string;
  updatedAt: string;
}

export default async (req: NowRequest, res: NowResponse) => {
  const station = req.query.station || '@6817';

  try {
    const { TOKEN } = process.env;
    const url = `https://api.waqi.info/feed/${station}/?token=${TOKEN}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    const responseBody = await response.json();

    // default values to display when the API is down:
    let aqi = -1;
    let updatedAt = 'N/A';
    const cityName = responseBody.data.city.name;

    // replace default values with values from the API
    if (responseBody.data.aqi !== '-') {
      aqi = responseBody.data.aqi;
      updatedAt = `${responseBody.data.time.iso}`;
    }

    const body: AQIData = {
      aqi,
      cityName,
      updatedAt,
    };

    return res.status(200).json(body);
  } catch (error) {
    return res.status(500).json({
      error: error.message || error.toString(),
    });
  }
};
