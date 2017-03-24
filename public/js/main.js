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
					updateUIValues(json.aqi, json.level, json.cityName, json.updatedAt);
					updateTextValue(json.level);
					setPageTitle(json.level);
				});
			}
		});
	}


	fetch(url)
		.then(response => response.json())
		.then(json => {
			updateUIValues(json.aqi, json.level, json.cityName, json.updatedAt);
			updateTextValue(json.level);
			updateContainerClass(json.level);
			setPageTitle(json.level);
		});

	function $(selector) {
		return document.querySelector(selector);
	}

	function updateUIValues(aqi, level, cityName, updatedAt) {
		$('#aqi-value').innerText = aqi || 0;
		$('#location').innerText = cityName || '';
		$('#updated-at').innerText = updatedAt || '';

		if (level) {
			document.querySelector('#container')
				.classList.add(`container--${level}`);
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
		if (level === 'MODERATE' || level === 'UNHEALTHY-SENSITIVE') {
			$('#container').classList.add('container--inverted');
		}
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
