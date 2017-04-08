(function () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/worker.js')
			.then(() => {
				console.log('ServiceWorker is registered.');
			}, () => {
				console.warn('Failed to register ServiceWorker.');
			});
	} else {
		console.warn('ServiceWorker is not supported.');
	}
})();

(function () {

	const url = `/api`;

	if ('caches' in window) {
		caches.match(url).then(response => {
			if (response) {
				response.json().then(json => {
					const level = getAqiLevel(json.aqi);
					updateUIValues(json.aqi, level, json.cityName, json.updatedAt);
					updateTextValue(level);
					updateContainerClass(level);
					setPageTitle(level);
				});
			}
		});
	}


	fetch(url)
		.then(response => response.json())
		.then(json => {
			const level = getAqiLevel(json.aqi);
			updateUIValues(json.aqi, level, json.cityName, json.updatedAt);
			updateTextValue(level);
			updateContainerClass(level);
			setPageTitle(level);
		});

	function $(selector) {
		return document.querySelector(selector);
	}

	function updateUIValues(aqi, level, cityName, updatedAt) {
		$('#aqi-value').innerText = aqi || 0;
		$('#location').innerText = cityName || '';
		$('#updated-at').innerText = updatedAt || '';

		if (level) {
			const $container = $('#container');
			$container.className = 'container';
			$container.classList.add(`container--${level}`);
		}

	}

	function updateTextValue(level) {
		if (!level) {
			return;
		}

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

	function setPageTitle(title) {
		document.title = `${title} - Chiang Mai AQI`;
	}

	function updateContainerClass(level) {
		const $container = $('#container');
		const invertClass = 'container--inverted';
		if (level === 'MODERATE' || level === 'UNHEALTHY-SENSITIVE') {
			$container.classList.add(invertClass);
		} else {
			$container.classList.remove(invertClass);
		}
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

	window.addEventListener('load', () => {
		const $message = $('#offline-message');
		const $container = $('#container');

		function updateOnlinStatus() {
			console.log($container);
			if (navigator.onLine) {
				$message.classList.remove('offline');
				$container.classList.remove('offline');
			} else {
				$message.classList.add('offline');
				$container.classList.add('offline');
			}
		}

		window.addEventListener('online', updateOnlinStatus);
		window.addEventListener('offline', updateOnlinStatus);
	});

})();
