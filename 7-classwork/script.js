const displayInPage = (HTMLContent) => {
  document.getElementById("content").innerHTML = HTMLContent;
};

const addCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const fetchDataFromInternet = async (subregion) => {
  displayInPage("<h1>Loading...</h1>");

  if (subregion === "nothing") {
    displayInPage("Please select a subregion.");
    return;
  }

  const res = await fetch(
    `https://restcountries.com/v3.1/subregion/${subregion}`,
  );
  const data = await res.json();

  let HTMLContent = "";

  data.forEach((country) => {
    HTMLContent += `
      <div class="country">
        <h2>${country.name.common}</h2>
        <div class="flag">
          <img src="${country.flags.png}" alt="${country.name.common} flag" width="100" />
        </div>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${addCommas(country.population)}</p>
        <p><b>Area:</b> ${addCommas(country.area)}</p>
        <p><b>Languages:</b> ${Object.values(country.languages).join(", ")}</p>
        <p><b>Timezones:</b> ${country.timezones.join(", ")}</p>
      </div>
    `;
  });

  displayInPage(HTMLContent);
  console.log(data);
};

document.getElementById("continents").addEventListener("change", (e) => {
  fetchDataFromInternet(e.target.value);
});
