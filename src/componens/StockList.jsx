import { useState, useEffect } from "react";
import { getDailyPerformance } from "../services/alphaVantageService";
import "../App.css";
import { createClient } from "@supabase/supabase-js";
import { FetchWatchlist, AddStock, RemoveStock } from "../services/supabaseWatchlistService";
import { useSession } from "@clerk/clerk-react";

export default function StockList({userId}){

  const {session} = useSession();

  const [symbol, setSymbol] = useState("");
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState("");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: () => session?.getToken({template: "supabase"})
  });

  async function handleFetchStocks(){
    const data = await FetchWatchlist(supabase, userId);
    setStocks(data);
  }

  async function handleAddStock(e){

    e.preventDefault();

    setError("");

    const ticker = symbol.toUpperCase();
    await AddStock(supabase, userId, ticker);

    setSymbol("");
    handleFetchStocks();
  }

  async function handleRemoveStock(id){
    await RemoveStock(supabase, id);
    handleFetchStocks();
  }

  async function loadPerformances(){
    const updated = await Promise.all(
      stocks.map(async stock => ({
        ...stock,
        perf: await getDailyPerformance(stock.symbol)
      }))
    )

    setStocks(updated);
  }

  useEffect(() => {if(userId) handleFetchStocks()}, [userId]);
  useEffect(() => {if(stocks.length) loadPerformances()}, [stocks.length]);

  return(
    <div>
      <form className="stock-form" onSubmit={handleAddStock}>
        <input
          value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="AAPL"
        />
        <button>+</button>

      </form>
       {error && <p style={{color: "red"}}>{error}</p>}

       <ul className="stock-list">
        {stocks.map(stock => {
        const perfNum = parseFloat(stock.perf)
        const perfColor = isNaN(perfNum) ? "black" : perfNum >= 0 ? "green" : "red"
        return (
          <li key={stock.id}>
            <span>
              <strong>{stock.symbol}</strong>{" "}
              <span style={{ color: perfColor }}>{stock.perf ? `${stock.perf}%` : "..."}</span>
            </span>
            <button className="remove-btn" onClick={() => handleRemoveStock(stock.id)}>X</button>
          </li>
        )
        })}
       </ul>
    </div>

  )
}
