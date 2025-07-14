import React, {Component} from 'react'
import Web3 from 'web3'
import logo from './logo.svg';
import './App.css';
import SimpleAbi from './contractsData/SimpleStorage.json'
import SimpleAddress from './contractsData/SimpleStorage-address.json'

class SimpleStorage extends Component {

    componentWillMount(){
        this.loadWeb3()
        this.loadBlockchainData()
    }
    async loadWeb3(){ 
	if (window.ethereum) { 
		window.web3 = new Web3(window.ethereum)
		await window.ethereum.enable()
        	window.alert('my window is connected!!!');

		window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
		    window.alert('my wallet is connected');
		})
	}
	else if (window.web3) { 
		window.web3 = new Web3(window.web3.currentProvider.enable())
	}
	else { 
		window.alert('non-ethereum browser detected - you should consider trying MetaMask!')
	}
    }
    async loadBlockchainData(){
        
        console.log('VotingAddress.address', SimpleAddress.address)
        console.log('VotingAbi.abi', SimpleAbi.abi)
	const web3 = new Web3(window.web3.currentProvider);
	this.setState( { web3 } )
        var account;
        const accounts  = await web3.eth.getAccounts()
	console.log(accounts)
	     web3.eth.getAccounts().then((f) => {
             account = f[0];
         })
	 console.log("account load blockchain data")
	 console.log(account)
	 console.log(accounts[0])

         //just copy the json file to the src directory
         const networkId = await web3.eth.net.getId();
         console.log(networkId);
         // const deployedNetwork = votingArtifact.networks[networkId];
	 this.setState( { account : accounts[0] }) 
	 console.log(account);
         const contract = new web3.eth.Contract(SimpleAbi.abi); 
  //       contract.options.address = jsonData['networks'][networkId]["address"]
         contract.options.address = SimpleAddress.address
	    //"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
         this.setState( { contract }) 
	}

  constructor(props){
	  	super(props)
		console.log("constructor")
	  	this.state = {
			account: '',
			loading: true,
			message: ''
			//data: todoList   // new portion
		}
  }

     setHandler = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText.value + ' to the contract');
		this.state.contract.methods.set(event.target.setText.value).send({ from: this.state.account });
	}

	 getCurrentVal = async () => {
		 let val = await this.state.contract.methods.get().call(console.log);
        this.setState( { message : val })
	 	}
	
render(){	

	return (
		<div>

		<h5>message output: {this.state.message}</h5>
		<h4> {"Get/Set Contract interaction"} </h4>
			<form onSubmit={this.setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={this.getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
		</div>
	);
}
}
export default SimpleStorage;

