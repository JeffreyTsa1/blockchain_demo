import React,{ useState, useEffect } from 'react'
import { ethers, BrowserProvider } from "ethers";
import { providers } from 'ethers/providers';

import { Card, CardContent } from "./components/ui/card";

import FundraiserAbif from './contractsData/FundraiserFactory.json'
import FundraiserAddressf from './contractsData/FundraiserFactory-address.json'
import FundraiserAbi from './contractsData/Fundraiser.json'
import FundraiserAddress from './contractsData/Fundraiser-address.json'


function App() {

  const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [details, setDetails] = useState({});
  const [donationAmount, setDonationAmount] = useState("");
  const [myDonations, setMyDonations] = useState([]);

  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fundraisers, setFundraisers] = useState([]);
  const [form, setForm] = useState({ name: "", url: "", imageURL: "", description: "", beneficiary: "" });




  useEffect(() => {
     // Connect to Ethereum
    const initialize = async () => {
      //const web3Provider = new ethers.JsonRpcProvider("http://ec2-44-252-77-188.us-west-2.compute.amazonaws.com:8545");
       const web3Provider = new BrowserProvider(window.ethereum);
       setProvider(web3Provider);
       const signer = await web3Provider.getSigner(0);

  const factoryInstance = new ethers.Contract(FundraiserAddressf.address, FundraiserAbif.abi, signer);

    //    setProvider(prov);
        setSigner(signer);
        setFactory(factoryInstance);

        const count = await factoryInstance.fundraisersCount();
        const data = [];
     
console.log("count = > ",count);

	    for (let i = 0; i < count; i++) {
          const addr = await factoryInstance.getFundraiserAt(i);
   //         const Fundraiser = await ethers.getContractFactory("Fundraiser");
 // const fundraiser = Fundraiser.attach(addr);
//console.log(await fundraiser.name())
console.log("addr =" ,addr);



	const fundraiser = new ethers.Contract(addr, FundraiserAbi.abi, signer);
          const name = await fundraiser.name();
          const imageURL = await fundraiser.imageURL();
console.log("imageURL",imageURL);
		    const description = await fundraiser.description();
          const totalDonations = await fundraiser.totalDonations();

          data.push({ addr, name, imageURL, description, totalDonations: ethers.formatEther(totalDonations) });
        }
        setFundraisers(data);
      }
   // };
    initialize();
  },  [FundraiserAddressf, FundraiserAbif]);


  const createFundraiser = async () => {
console.log("within create creatFund....");
	  

	  const { name, url, imageURL, description, beneficiary } = form;
	  console.log("name  = ", name);



	  if (!factory || !name || !beneficiary) return;
  console.log("just before the call to create fundraiser")



        const count = await factory.fundraisersCount();
console.log("count = ",count);
	  const tx = await factory.createFundraiser(name, url, imageURL, description, signer);  // beneficiary);
    await tx.wait();
    alert("Fundraiser created!");
    window.location.reload();
  };

  const handleDonate = async () => {
    if (!selectedFundraiser || !donationAmount) return;
    const contract = new ethers.Contract(selectedFundraiser.addr, FundraiserAbi.abi, signer);
    const tx = await contract.donate({ value: ethers.parseEther(donationAmount) });
    await tx.wait();
    alert("Donation successful!");
    setDonationAmount("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Create New Fundraiser</h2>
          <input placeholder="Name" className="w-full border p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="URL" className="w-full border p-2" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input placeholder="Image URL" className="w-full border p-2" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} />
          <input placeholder="Description" className="w-full border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Beneficiary Address" className="w-full border p-2" value={form.beneficiary} onChange={(e) => setForm({ ...form, beneficiary: e.target.value })} />
          <button onClick={createFundraiser}>Create</button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Existing Fundraisers</h2>
        {fundraisers.map((f, idx) => (
          <Card key={idx}>
            <CardContent className="space-y-2">
              <h3 className="text-xl font-bold">{f.name}</h3>
              <img src={f.imageURL} alt="Fundraiser" className="w-full h-64 object-cover" />
              <p>{f.description}</p>
              <p>Total Raised: {f.totalDonations} ETH</p>
              <a href={`https://etherscan.io/address/${f.addr}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on Etherscan</a>
              <button variant="outline" onClick={() => setSelectedFundraiser(f)}>Donate to this Fundraiser</button>

		</CardContent>
          </Card>
        ))}
      </div>
   
      {selectedFundraiser && (
        <Card className="mt-10">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">Donate to {selectedFundraiser.name}</h2>
            <input
              type="text"
              className="w-full border p-2"
              placeholder="Amount in ETH"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button onClick={handleDonate}>Submit Donation</button>
          </CardContent>
        </Card>
      )}

	  </div>
  );
}

export default App;
