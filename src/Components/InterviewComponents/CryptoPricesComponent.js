import { useEffect, useState } from "react";

export default function CryptoPrices() {
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPricesData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setError(null);
      const bitcoinPrice = data.bitcoin.usd;
      const ethereumPrice = data.ethereum.usd;
      setPrices({ bitcoinPrice, ethereumPrice });
      setIsLoading(false);
    } catch (e) {
      setError("Failed to fetch prices");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run the fetchPricesData function immediately
    fetchPricesData();

    // Set up the interval to run fetchPricesData every 10 seconds
    const interval = setInterval(() => {
      fetchPricesData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        <h1 style={{ color: "red", display: "flex", justifyContent: "center" }}>
          Data Processing
        </h1>
      ) : (
        <div>
          {error ? (
            <div style={{ color: "red", textAlign: "center" }}>
              {error}
            </div>
          ) : (
            <div>
              <h1
                style={{
                  color: "red",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                CryptoPrices Component
              </h1>
              <div style={{ textAlign: "center" }}>
                <span>Bitcoin: </span>
                <span>{prices.bitcoinPrice}</span>
                <br />
                <span>Ethereum: </span>
                <span>{prices.ethereumPrice}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
