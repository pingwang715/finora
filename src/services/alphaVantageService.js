const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query?";

async function fetchJSON(queryParams) {
  const url = `${BASE_URL}${new URLSearchParams({
    ...queryParams,
    apikey: API_KEY,
  })}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error("Alpha Vantage request failed.");

  return response.json();
}

export async function getDailyPerformance(ticker){

  const json = await fetchJSON({
    function: "TIME_SERIES_DAILY",
    symbol: ticker
  });

  const timeSeries = json["Time Series (Daily)"];

  if(!timeSeries) return null;

  const [latestDate, previousDate] = Object.keys(timeSeries);

  if(latestDate == null || previousDate == null) return null;

  const latestClose = parseFloat(timeSeries[latestDate]["4. close"]);
  const previousClose = parseFloat(timeSeries[previousDate]["4. close"]);

  const performance = ((latestClose / previousClose -1) * 100).toFixed(2);

  return performance;
}
