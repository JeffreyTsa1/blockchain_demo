import { useState } from "react";
import { useApp } from "../store";

export default function ProfileForm() {
  const { contract } = useApp();
  const [age, setAge] = useState("");
  const [location, setLoc] = useState("");
  const [nationality, setNat] = useState("");

  const submit = async () => {
    if (!contract) return alert("Contract not ready");
    await (await contract.setUserProfile(Number(age || 0), location, nationality)).wait();
    alert("Profile saved");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Profile</h3>
      <input placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLoc(e.target.value)} style={{ marginLeft: 8 }} />
      <input placeholder="Nationality" value={nationality} onChange={(e) => setNat(e.target.value)} style={{ marginLeft: 8 }} />
      <button onClick={submit} style={{ marginLeft: 8 }}>Save</button>
    </div>
  );
}
