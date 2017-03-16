(function () {
	const endpoint = 'http://api.waqi.info/feed/';
	const chaingmaiStationId = '@6817';
	const token = 'TOKEN';

	const url = `${endpoint}${chaingmaiStationId}/?token=${token}`;

	fetch(url)
		.then(response => response.json())
		.then(json => {
			const aqi = json.data.aqi;
			const level = getAqiLevel(aqi);
			const cityName = json.data.city.name;
			const updatedAt = json.data.time.s + json.data.time.tz;

			updateUI(aqi, level, cityName, updatedAt);
			updateTextValue(level);
		});

	function $(selector) {
		return document.querySelector(selector);
	}

	function updateUI(aqi, level, cityName, updatedAt) {
		$('#aqi-value').innerText = aqi;
		$('#location').innerText = cityName;
		$('#updated-at').innerText = updatedAt;

		document.querySelector('#container')
			.classList.add(`container--${level}`);
	}

	function updateTextValue(level) {
		const $textElement = $('#aqi-text-value');
		if (level === 'UNHEALTHY-SENSITIVE') {
			$textElement.innerText = 'Unhealthy';
			$('#aqi-text-extra').innerText = 'for Sensitive Group';
			return;
		}

		if (level === 'VERY-UNHEALTHY') {
			$textElement.innerText = 'Very Unhealthy';
			return;
		}

		$textElement.innerText = level.toLowerCase();
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

})();
