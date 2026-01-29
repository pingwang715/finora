import { useState } from "react";
import { getDailyPerformance } from "../services/alphaVantageService";
import "../App.css";

export default function StockList({userId}){

  const [symbol, setSymbol] = useState("");
  const [performance, setPerformance] = useState("");
  const [error, setError] = useState("");

  async function handleAddStock(e){
    e.preventDefault();
    setError("");
    setPerformance("");

    try {

      const perf = await getDailyPerformance(symbol.toUpperCase());
      if(!perf) {
         setError("No stock data loaded");
         return null;
      }

      setPerformance(perf);

    } catch {
      setError("An error was occurred.");
    }
  }

  return(
    <div>
      <form className="stock-form" onSubmit={handleAddStock}>
        <input
          value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="AAPL"
        />
        <button>Check</button>

        {error && <p style={{color: "red"}}>{error}</p>}
        {performance && (
          <p style={{color: performance > 0 ? "green" : "red"}}>
            {performance}%
          </p>)}
      </form>
    </div>
  )



}
