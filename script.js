async function getData(cityName) {
  try {
    const API_KEY = "94b6b938ccbeb39dc81ec138e42d84ad";
    const BASE_API = "https://api.openweathermap.org/data/2.5/weather";
    const url = `${BASE_API}?q=${cityName}&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    const temperature = data;
    return temperature;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

const dispayWeatherData = (dataInfo) => {
  console.log(dataInfo);
  const { temp, feels_like } = dataInfo.main;
  const { name } = dataInfo;

  const weatherImage = dataInfo.weather[0].main;
  const imagePath = `image/${weatherImage.toLowerCase()}.gif`;

  const imageweat = document.querySelector(".weather-icon");
  imageweat.classList.add("weathershow");
  imageweat.setAttribute("src", imagePath);

  const nameDisplay = document.querySelector(".name");
  nameDisplay.textContent = name;

  const tempDis = document.querySelector(".temp");
  tempDis.innerHTML = "Temperature:" + Math.round(temp - 273.15) + "°C";

  const feelsDis = document.querySelector(".feels");
  feelsDis.innerHTML = "Feels like:" + Math.round(feels_like - 273.15) + "°C";
};
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const weatherData = await getData("Sylhet");
    dispayWeatherData(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
});

const whaterform = document.querySelector("#form");
whaterform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cityIfo = whaterform.search.value;
  const weatherData = await getData(cityIfo);
  dispayWeatherData(weatherData);
  whaterform.reset();
});

(function timeShow() {
  const date = new Date();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let session = "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
    session = "PM";
  }

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const timeString = `${hours}:${minutes}:${seconds} ${session}`;
  document.getElementById("clock").textContent = timeString;

  setTimeout(timeShow, 1000);
})();

function themeShow() {
  const body = document.querySelector("body");

  function setTheme(theme) {
    body.classList.remove("light", "dark");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  prefersDark.addEventListener("change", function () {
    setTheme(this.matches ? "dark" : "light");
  });

  function toggleTheme(theme) {
    setTheme(theme);
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("theme-buttons");

  const lightButton = document.createElement("span");

  lightButton.innerHTML = `<ion-icon class="theme-icon" name="sunny-outline"></ion-icon>`;
  lightButton.addEventListener("click", () => toggleTheme("light"));

  const darkButton = document.createElement("span");
  darkButton.innerHTML = `<ion-icon class="theme-icon" name="moon-outline"></ion-icon>`;
  darkButton.addEventListener("click", () => toggleTheme("dark"));

  const systemButton = document.createElement("span");
  systemButton.innerHTML = `<ion-icon class="theme-icon" name="laptop-outline"></ion-icon>

`;
  systemButton.addEventListener("click", () => {
    setTheme(prefersDark.matches ? "dark" : "light");
  });

  buttonContainer.appendChild(lightButton);
  buttonContainer.appendChild(darkButton);
  buttonContainer.appendChild(systemButton);

  document.querySelector(".theme").appendChild(buttonContainer);

  let theme = localStorage.getItem("theme");
  theme = theme ? theme : prefersDark.matches ? "dark" : "light";
  setTheme(theme);
}
themeShow();

// device brousbdkkdh

const navigatorErrorMessage =
  "Could not find `userAgent` or `userAgentData` window.navigator properties to set `os`, `browser` and `version`";
const removeExcessMozillaAndVersion = /^mozilla\/\d\.\d\W/;
const browserPattern = /(\w+)\/(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)/g;
const engineAndVersionPattern = /^(ver|cri|gec)/;
const brandList = ["chrome", "opera", "safari", "edge", "firefox"];
const unknown = "Unknown";
const empty = "";
const { isArray } = Array;
let userAgentData = window.navigator.userAgentData;
let userAgent = window.navigator.userAgent;

const mobiles = {
  iphone: /iphone/,
  ipad: /ipad|macintosh/,
  android: /android/,
};

const desktops = {
  windows: /win/,
  mac: /macintosh/,
  linux: /linux/,
};

const detectPlatform = (customUserAgent, customUserAgentData) => {
  userAgent = typeof customUserAgent === "string" ? customUserAgent : userAgent;
  userAgentData =
    typeof customUserAgentData === "string"
      ? customUserAgentData
      : userAgentData;

  if (userAgent) {
    const ua = userAgent
      .toLowerCase()
      .replace(removeExcessMozillaAndVersion, empty);

    const mobileOS = Object.keys(mobiles).find(
      (os) => mobiles[os].test(ua) && window.navigator.maxTouchPoints >= 1
    );
    const desktopOS = Object.keys(desktops).find((os) => desktops[os].test(ua));
    const os = mobileOS || desktopOS;

    const browserTest = ua.match(browserPattern);
    const versionRegex = /version\/(\d+(\.\d+)*)/;
    const safariVersion = ua.match(versionRegex);
    const saVesion = isArray(safariVersion) ? safariVersion[1] : null;
    const browserOffset =
      browserTest &&
      (browserTest.length > 2 && !engineAndVersionPattern.test(browserTest[1])
        ? 1
        : 0);
    const browserResult =
      browserTest &&
      browserTest[browserTest.length - 1 - (browserOffset || 0)].split("/");
    const browser = browserResult && browserResult[0];
    const version = saVesion ? saVesion : browserResult && browserResult[1];

    return { os, browser, version };
  } else if (userAgentData) {
    const os = userAgentData.platform.toLowerCase();
    let platformData;

    for (const agentBrand of userAgentData.brands) {
      const agentBrandEntry = agentBrand.brand.toLowerCase();
      const foundBrand = brandList.find((brand) => {
        if (agentBrandEntry.includes(brand)) {
          return brand;
        }
      });
      if (foundBrand) {
        platformData = { browser: foundBrand, version: agentBrand.version };
        break;
      }
    }
    const brandVersionData = platformData || {
      browser: unknown,
      version: unknown,
    };
    return { os, ...brandVersionData };
  } else {
    console.error(navigatorErrorMessage);

    return {
      os: navigator.platform || unknown,
      browser: unknown,
      version: unknown,
    };
  }
};

export default detectPlatform;

console.log(detectPlatform());
const { browser } = detectPlatform();
console.log(browser);
const browserinfo = browser;
console.log(browserinfo);

if (browserinfo === "chrome") {
  (function batteryShow() {
    navigator
      .getBattery()
      .then(function (battery) {
        setInterval(() => {
          let batteryLevel = Math.round(battery.level * 100);
          let batteryStatus = battery.charging ? "Charging" : "Not charging";

          const batterybody = document.querySelector(".battery");
          if (batteryStatus === "Charging") {
            const html = `<div class="batteryindi">
          <span class="buttery-level" "><ion-icon class="batteryicon" name="battery-charging-outline"></ion-icon></span>
          <div className="batterytext">${batteryLevel}%</div>
          </div>`;
            batterybody.innerHTML = html;
          } else if (batteryStatus === "Not charging") {
            const html = `<div class="batteryindi">
          <span class="buttery-level" "><ion-icon class="batteryicon"  name="battery-half-outline"></ion-icon></span>
          <div className="batterytext">${batteryLevel}%</div>
          </div>`;
            batterybody.innerHTML = html;
          }
        }, 1000);
      })
      .catch(function (e) {
        console.error(e);
      });
  })();
}
