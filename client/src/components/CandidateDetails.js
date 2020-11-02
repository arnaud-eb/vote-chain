import React, { Component } from "react";
import VoteChainContract from "../contracts/VoteChain.json";
import getWeb3 from "../getWeb3";
import Navigation from "./Navigation";
import NavigationAdmin from "./NavigationAdmin";
import { Loader } from "rimble-ui";

import "../App.css";

class CandidateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VoteChainInstance: null,
            account: null,
            web3: null,
            isOwner: false,
            candidates: []
        };
        this.updateCandidates = this.updateCandidates.bind(this);
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

    updateCandidates = async() => {
        const { VoteChainInstance } = this.state;
        const candidateCount = await VoteChainInstance.methods.getCandidateNumber().call();
        const candidates = [];
        for(var i = 0; i < candidateCount; i++) {
            var candidate = await VoteChainInstance.methods.candidateDetails(i).call();
            candidates.push(candidate);
        }
        
        this.setState({
            candidates
        });
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
        this.updateCandidates();
        const renderCandidates = this.state.candidates.map(candidate => <Candidate 
                                                                        name={candidate.name} 
                                                                        party={candidate.party}
                                                                        manifesto={candidate.manifesto}
                                                                        vote={candidate.voteCount}
                                                                        constituency={candidate.constituency}
                                                                        id={candidate.candidateId}/>);
        return(
            <div className="App">
                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>CANDIDATES</h1>
                    </div>
                </div>
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                
                <div className="details">
                    {renderCandidates}
                </div>
            </div>
        );
    }
}

const Candidate = (props) => {
    return(
        <div className="candidate">
            <ul>
                <li>Name: {props.name}</li>
                <li>Party: {props.party}</li>
                <li>Manifesto: {props.manifesto}</li>
                <li>#Vote: {props.vote}</li>
                <li>Constituency: {props.constituency}</li>
                <li>ID: {props.id}</li>
            </ul>
        </div>
    )
}

export default CandidateDetails;

