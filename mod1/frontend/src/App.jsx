import React, { Component } from 'react'
import Web3 from 'web3'
import HelloAbi from './contractsData/Hello.json'
import HelloAddress from './contractsData/Hello-address.json'

class App extends Component {
  constructor(props) {
    super(props)
    console.log("constructor")
    this.state = {
      account: '',
      contract: null,
      message: ''
    }
  }

  async componentDidMount() {
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    try {
      console.log('HelloAddress.address', HelloAddress.address)
      console.log('HelloAbi.abi', HelloAbi.abi)

      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://ec2-13-59-79-136.us-east-2.compute.amazonaws.com:8545")
      )

      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]
      console.log("accounts:", accounts)

      const contract = new web3.eth.Contract(HelloAbi.abi, HelloAddress.address)

      this.setState({ web3, account, contract })
    } catch (err) {
      console.error("Error loading blockchain data:", err)
    }
  }

  setHandler = async (event) => {
    event.preventDefault()
    const value = event.target.setText.value
    console.log('sending', value, 'to the contract')

    const { contract, account } = this.state
    if (contract) {
      await contract.methods.set(value).send({ from: account })
    } else {
      console.warn("Contract not yet loaded.")
    }
  }

  getCurrentVal = async () => {
    const { contract } = this.state
    if (!contract) {
      console.warn("Contract not yet loaded.")
      return
    }

    const val = await contract.methods.get().call()
    console.log("val", val)
    this.setState({ message: val })
  }

  render() {
    return (
      <div>
        <h5>Message output: {this.state.message}</h5>
        <h4>Get/Set Contract Interaction</h4>

        <form onSubmit={this.setHandler}>
          <input id="setText" type="text" />
          <button type="submit">Update Contract</button>
        </form>

        <div>
          <button onClick={this.getCurrentVal} style={{ marginTop: '5em' }}>
            Get Current Contract Value
          </button>
        </div>
      </div>
    )
  }
}

export default App
