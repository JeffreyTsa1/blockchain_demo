import { useEffect } from "react";
import { ethers } from "ethers";
import { useApp } from "./store";
import { TRUTHLEDGER_ABI, TRUTHLEDGER_ADDRESS } from "./config";
import ProfileForm from "./components/ProfileForm";
import SubmitArticleForm from "./components/SubmitArticleForm";
import ArticleList from "./components/ArticleList";

export default function App() {
  const { setAccount, setContract } = useApp();

  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const [acc] = await provider.send("eth_requestAccounts", []);
      setAccount(acc);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TRUTHLEDGER_ADDRESS, TRUTHLEDGER_ABI, signer);
      setContract(contract);
    })();
  }, [setAccount, setContract]);

  return (
    <div style={{ padding: 24 }}>
      <h1>🛡️ TruthLedger</h1>
      <ProfileForm />
      <SubmitArticleForm />
      <ArticleList />
    </div>
  );
}
