(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js').then(
      () => {
        console.log('ServiceWorker is registered.');
      },
      () => {
        console.warn('Failed to register ServiceWorker.');
      }
    );
  } else {
    console.warn('ServiceWorker is not supported.');
  }
})();

(function () {
  const url = `/api/get-aqi`;

  if ('caches' in window) {
    caches.match(url).then((response) => {
      if (response) {
        response.json().then((json) => {
          const level = getAqiLevel(json.aqi);
          updateUIValues(json.aqi, level, json.cityName, json.updatedAt);
          updateTextValue(level);
          setPageTitle(level);
        });
      }
    });
  }

  fetchData(url);

  function fetchData(url, stationId) {
    if (stationId) {
      url = url + '/' + stationId;
    }

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const level = getAqiLevel(json.aqi);
        updateUIValues(json.aqi, level, json.cityName, json.updatedAt);
        updateTextValue(level);
        setPageTitle(level);
      });
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function updateUIValues(aqi, level, cityName, updatedAt) {
    const $value = $('#aqi-value');
    if (aqi && aqi !== -1) {
      $value.innerText = aqi;
    } else {
      $value.innerText = '-';
    }

    $('#updated-at').innerText = new Date(updatedAt).toLocaleTimeString() || '';

    if (level && level !== 'N/A') {
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
    const $extraText = $('#aqi-text-extra');
    if (level === 'N/A') {
      $textElement.innerText = 'N/A';
      $extraText.innerText = '';
      return;
    }

    if (level === 'UNHEALTHY-SENSITIVE') {
      $textElement.innerText = 'Unhealthy';
      $extraText.innerText = 'for Sensitive Group';
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

  function getAqiLevel(index) {
    if (index === -1) {
      // error
      return 'N/A';
    }

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
