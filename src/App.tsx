import './App.css'
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import StockList from "./componens/StockList";

function App() {

  const { user } = useUser();

  return (
    <div className="app-container">

      <header>
        <h1>Finora.io</h1>
        <h3>Track your favorite stocks</h3>
      </header>

      <SignedOut>
        <div>
          <p>Log in to manage your stocks</p>
          <SignIn />
        </div>

      </SignedOut>

      <SignedIn>
        {user ? (
          <>
          <div className="user-header">
            <UserButton />
            <p>Hello {user.firstName || user.username || "User"} 👋</p>
          </div>

          <StockList userId={user.id}></StockList>
          </>
        ) : (<p>Loading User</p>)}

      </SignedIn>

    </div>
  );
}

export default App
