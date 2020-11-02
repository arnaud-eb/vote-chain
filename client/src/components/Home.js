import React, { Component } from "react";
import VoteChainContract from "../contracts/VoteChain.json";
import getWeb3 from "../getWeb3";
import Navigation from "./Navigation";
import NavigationAdmin from "./NavigationAdmin";
import { Loader } from "rimble-ui";

import "../App.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VoteChainInstance: null,
      account: null,
      web3: null,
      isOwner: false,
      start: false,
      end: false
    };
  }

  componentDidMount = async () => {
    //for refreshing page only
    if(!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VoteChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VoteChainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3, 
        account: accounts[0],
        VoteChainInstance: instance 
      });

      const owner = await this.state.VoteChainInstance.methods.getOwner().call();
      if(this.state.account === owner) {
        this.setState({
          isOwner: true
        });
      }

      const start = await this.state.VoteChainInstance.methods.getStart().call();
      const end = await this.state.VoteChainInstance.methods.getEnd().call();
      this.setState({
        start,
        end
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  render() {
    if (!this.state.web3) {
      return(
        <div className="App">
          <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <Loader size="80px"/>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>VOTECHAIN PORTAL</h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        
        <div className="home">
          WELCOME TO VOTING SYSTEM
        </div>
      </div>
    );
  }
}

export default Home;
