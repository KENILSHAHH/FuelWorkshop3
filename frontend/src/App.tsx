import { useEffect, useState } from 'react';
import './App.css';
import { CounterContractAbi__factory } from './contracts';

const CONTRACT_ID =
  '0xf71eae5c832bb873e13538a2b1440de4bc5ee46cf1fea8a424c0cb1c6b127fc5';

function App() {
  const [account, setAccount] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);
  const [count, setCount] = useState<number>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      checkConnection();
      setLoaded(true);
    }, 200);
    if (connected) getCount();
  }, [connected]);

  async function checkConnection() {
    if (window.fuel) {
      const isConnected = await window.fuel.isConnected();
      if (isConnected) {
        const [account] = await window.fuel.accounts();
        setAccount(account);
        setConnected(true);
      }
    }
  }

  const connect = async () => {
    if (window.fuel) {
      await window.fuel.connect();
      const [account] = await window.fuel.accounts();
      setAccount(account);
      setConnected(true);
    }
  };

  const getCount = async () => {
    const amountToPass = 100
    if (window.fuel && account) {
      const wallet = await window.fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      const { value } = await contract.functions.count(amountToPass).simulate();
      setCount(value.toNumber());
    }
  };

  const increment = async () => {
    if (window.fuel && account) {
      const wallet = await window.fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      await contract.functions
        .increment()
        .txParams({
          gasPrice: 1,
        })
        .call();
      await getCount();
    }
  };

  if (!loaded) return null;

  return (
    <div className='App'>
      {connected ? (
        <div>
          <p>Counter: {count}</p>
        <form>
  <label>
              Enter Amount in Gwei
              
    <input  type="text" name="Enter Amount in Gwei" />
  </label>

</form>
          <button onClick={increment}> Increment </button>
        </div>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
}

export default App;
