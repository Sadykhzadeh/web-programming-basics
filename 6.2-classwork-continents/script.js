const displayInPage = (HTMLContent) => {
  document.getElementById("content").innerHTML = HTMLContent;
};

const addCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const escapeHtml = (text) => {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML.replace(/"/g, "&quot;");
};

// The country list used to come from the REST Countries v3.1 API, which has
// been shut down (its replacement needs a personal API key), so the same data
// now lives next to the page in countries.json.
const fetchCountries = async () => {
  const res = await fetch("countries.json");
  if (!res.ok) throw new Error(`countries.json: ${res.status}`);
  return res.json();
};

const showCountries = async (continent) => {
  displayInPage("<h1>Loading...</h1>");

  if (continent === "nothing") {
    displayInPage("Please select a continent.");
    return;
  }

  let data;
  try {
    data = await fetchCountries();
  } catch (error) {
    console.error(error);
    displayInPage("Could not load countries.");
    return;
  }

  let HTMLContent = "";

  data.filter((country) => country.continent === continent).forEach(
    (country) => {
      HTMLContent += `
      <div class="country">
        <h2>${escapeHtml(country.name)}</h2>
        <div class="flag">
          <img src="${escapeHtml(country.flag)}" alt="${
        escapeHtml(country.name)
      } flag" width="100" />
        </div>
        <p><b>Capital:</b> ${escapeHtml(country.capital ?? "none")}</p>
        <p><b>Population:</b> ${addCommas(country.population)}</p>
        <p><b>Area:</b> ${
        country.area === null ? "unknown" : addCommas(country.area)
      }</p>
        <p><b>Languages:</b> ${escapeHtml(country.languages.join(", "))}</p>
        <p><b>Timezones:</b> ${escapeHtml(country.timezones.join(", "))}</p>
      </div>
    `;
    },
  );

  displayInPage(HTMLContent);
};

document.getElementById("continents").addEventListener("change", (e) => {
  showCountries(e.target.value);
});
