// enter an api key here
// i am using a paid alphavantage key
const API_KEY = "";

document.getElementById("check-price").addEventListener("click", async () => {
  // make sure that the symbol is in uppercase even if the user inputs it in lowercase
  const symbol = document.getElementById("stock-symbol").value.toUpperCase();
  const stock_result = document.getElementById("result");

  // make sure that the stock symbol is valid
  if (!symbol || !/^[A-Z]{1,5}$/.test(symbol)) {
    stock_result.textContent = "Please enter a valid stock symbol.";
    return;
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stock price.");
    }

    const data = await response.json();
    const price = data["Global Quote"]?.["05. price"];

    if (price) {
      stock_result.textContent = `The current price of ${symbol} is $${price}`;
    } else {
      stock_result.textContent = "Stock symbol not found";
    }
  } catch (error) {
    stock_result.textContent = `Error: ${error.message}`;
  }
});


async function stock_function(symbol, functionType) {
  const stock_result = document.getElementById("result");

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Unable to get data. Please try again later.");
    }

    const data = await response.json();

    const timeSeriesKey =
      functionType === "TIME_SERIES_DAILY"
        ? "Time Series (Daily)"
        : functionType === "TIME_SERIES_WEEKLY"
        ? "Weekly Time Series"
        : functionType === "TIME_SERIES_MONTHLY"
        ? "Monthly Time Series"
        : null;

    const timeSeries = data[timeSeriesKey];

    const dates = Object.keys(timeSeries);

    const latestDate = dates[0];
    const comparisonDate = dates[1];
    const latestPrice = parseFloat(timeSeries[latestDate]["4. close"]);
    const comparisonPrice = parseFloat(timeSeries[comparisonDate]["4. close"]);
    const change = latestPrice - comparisonPrice;

    const period =
      functionType === "TIME_SERIES_DAILY"
        ? "daily"
        : functionType === "TIME_SERIES_WEEKLY"
        ? "weekly"
        : functionType === "TIME_SERIES_MONTHLY"
        ? "monthly"
        : "selected period";

    const alteredSymbol = change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);

    stock_result.textContent = `${period.charAt(0).toUpperCase() + period.slice(1)} change for ${symbol}: ${alteredSymbol}`;


    if (change < 0) {
      stock_result.style.backgroundColor = "#f8d7da"; // Red if negative change
      stock_result.style.color = "#721c24";
      stock_result.style.border = "3px solid #6b3439";
    } else {
      stock_result.style.backgroundColor = "#d4edda"; // Green if positive change
      stock_result.style.color = "#155724";
      stock_result.style.border = "3px solid green";
    }
  } catch (error) {
    stock_result.textContent = `Error: ${error.message}`;
  }
}

document.getElementById("daily-change").addEventListener("click", () => {
  const symbol = document.getElementById("stock-symbol").value.toUpperCase();
  if (symbol) stock_function(symbol, "TIME_SERIES_DAILY");
});

document.getElementById("weekly-change").addEventListener("click", () => {
  const symbol = document.getElementById("stock-symbol").value.toUpperCase();
  if (symbol) stock_function(symbol, "TIME_SERIES_WEEKLY");
});

document.getElementById("monthly-change").addEventListener("click", () => {
  const symbol = document.getElementById("stock-symbol").value.toUpperCase();
  if (symbol) stock_function(symbol, "TIME_SERIES_MONTHLY");
});
