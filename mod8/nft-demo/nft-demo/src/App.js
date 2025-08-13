import React,{ useState, useEffect } from 'react'
import { ethers, BrowserProvider } from "ethers";
import { providers } from 'ethers/providers';
import ColorAbi from './contractsData/Color.json'
import ColorAddress from './contractsData/Color-address.json'

//import Color from './Color.json'

function App() {
  const [colorCode, setColorCode] = useState("");
	const [provider, setProvider] = useState(null);
  const [colors, setColors] = useState([]);
   const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [result, setResult] = useState("");
  const [wager, setWager] = useState("");
  const [display, setDisplay] = useState("");
  const [guess, setGuess] = useState(true); // true for higher, false for lower
  const [playerSessions, setPlayerSessions] = useState([]);
  const [totalSupply, setTotalSupply] = useState([]);



  useEffect(() => {
     // Connect to Ethereum
    const initialize = async () => {
    const web3Provider = new ethers.JsonRpcProvider("http://ec2-34-218-232-122.us-west-2.compute.amazonaws.com:8545");
    //const web3Provider = new BrowserProvider(window.ethereum);
    setProvider(web3Provider);
    const signer = await web3Provider.getSigner(0);
    setSigner(signer);
    const ColorContract = new ethers.Contract(ColorAddress.address, ColorAbi.abi, signer);
    setContract(ColorContract);

 //   const tx  = await ColorContract.mint("#FFFFFA");
         //const tx = await  contract.mint(color, {from: signer[0] ,value: ethers.parseEther("100") });
 // await tx.wait();

  // const tx2  = await ColorContract.mint("#FFFF1A");
         //const tx = await  contract.mint(color, {from: signer[0] ,value: ethers.parseEther("100") });
 // await tx2.wait();




   const totalSupply = await ColorContract.totalSupply()
   //this.setState({ totalSupply })
   console.log("totalSupply- " ,totalSupply);

	    setTotalSupply(totalSupply);

let colorList = [];
	    // Load Colors
   for (var i = 1; i <= totalSupply; i++) {
      const color = await ColorContract.colors(i - 1)
	console.log("color  = ",color)   
        colorList.push(color);
   }
setColors(colorList);

console.log("colors", colors)




    };
    initialize();
  }, [ColorAddress, ColorAbi]);

 const  mint = async  (color) => {

console.log('just before mint : ', color)
    const tx  = await contract.mint(color);
	 //const tx = await  contract.mint(color, {from: signer[0] ,value: ethers.parseEther("100") });
  await tx.wait();

//	 this.setState({
  //      colors: [...colors, color]
   //   })
  }

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0
shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
            


			//const color = this.color.value
		//	const color  = '#FFFF1F'


                         mint(

         colorCode 

			)
           
                }}>
        <label>Color Code: </label>
        <input type="text" value={colorCode} onChange={e => setColorCode(e.target.value)} />




	    <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
   <div className="row text-center">
            { colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: color,
              border: '1px solid #333',
              borderRadius: '8px',
            }}
          /> 




		      <div>{color}</div>
                </div>
              )
            }




	    )}
          </div>







	    </div>
      </div>
    );
  }


export default App;

