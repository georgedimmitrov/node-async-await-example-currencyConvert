const axios = require('axios');

// promises
// const getExchangeRate = (from, to) => {
//   return axios.get(`http://api.fixer.io/latest?base=${from}`).then(response => {
//     return response.data.rates[to];
//   });
// };

const getExchangeRate = async (from, to) => {
  try {
    const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
    const rate = response.data.rates[to];

    if (!rate) {
      throw new Error(`Unable to get exchange rate from ${from} to ${to}.`);
    }

    return rate;
  } catch(e) {
    throw new Error(`Unable to get exchange rate from ${from} to ${to}.`);
  }

};

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map(country => country.name);
  } catch(e) {
    throw new Error(`Unable to get countries that use ${currencyCode}.`);
  }
};

const convertCurrency = (from, to, amount) => {
  let countries;
  return getCountries(to).then(tempCountries => {
    countries = tempCountries;
    return getExchangeRate(from, to);
  }).then(rate => {
    const exchangedAmount = amount * rate;

    return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;
  });
};

const convertCurrencyAlt = async (from, to, amount) => {
  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);
  const exchangedAmount = amount * rate;

  return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;
};

convertCurrencyAlt('EUR', 'BGN', 100).then(status => {
  console.log(status);
}).catch(e => {
  console.log(e);
});
