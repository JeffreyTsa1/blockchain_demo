import { useState } from "react";
import { useApp } from "../store";

export default function SubmitArticleForm() {
  const { contract } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCat] = useState("");
  const [ipfs, setIpfs] = useState("");

  const submit = async () => {
    if (!contract) return alert("Contract not ready");
    await (await contract.submitArticle(title, category, ipfs)).wait();
    setTitle(""); setCat(""); setIpfs("");
    alert("Article submitted");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Submit Article</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCat(e.target.value)} style={{ marginLeft: 8 }} />
      <input placeholder="IPFS Hash" value={ipfs} onChange={(e) => setIpfs(e.target.value)} style={{ marginLeft: 8 }} />
      <button onClick={submit} style={{ marginLeft: 8 }}>Submit</button>
    </div>
  );
}
