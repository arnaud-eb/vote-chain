import React, { Component } from "react";
import VoteChainContract from "../contracts/VoteChain.json";
import getWeb3 from "../getWeb3";

import { Form, Col, Row, Button } from "react-bootstrap";
import { Loader } from "rimble-ui";

import Navigation from "./Navigation";
import NavigationAdmin from "./NavigationAdmin";

class AddCandidate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VoteChainInstance: null,
            account: null,
            web3: null,
            name: "",
            party: "",
            manifesto: "",
            constituency: "",
            candidates: "",
            isOwner: false
        };
        this.updateName = this.updateName.bind(this);
        this.updateParty = this.updateParty.bind(this);
        this.updateManifesto = this.updateManifesto.bind(this);
        this.updateConstituency = this.updateConstituency.bind(this);
        this.addCandidate = this.addCandidate.bind(this);
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
        } catch(error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }   
    }

    updateName(event) {
        this.setState({
            name: event.target.value
        });
    }

    updateParty(event) {
        this.setState({
            party: event.target.value
        });
    }

    updateManifesto(event) {
        this.setState({
            manifesto: event.target.value
        });
    }

    updateConstituency(event) {
        this.setState({
            constituency: event.target.value
        });
    }

    addCandidate = async () => {
        const { VoteChainInstance, name, party, manifesto, constituency, account } = this.state;
        await VoteChainInstance.methods.addCandidate(name, party, manifesto, parseInt(constituency)).send({from: account});
        window.location.reload();
    }

    render() {
        if(!this.state.web3) {
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
        if(!this.state.isOwner) {
            return(
                <div className="App">
                    <div className="CandidateDetails">
                        <div className="CandidateDetails-title">
                            <h1>ONLY ADMIN CAN ACCESS</h1>
                        </div>
                    </div>
                    {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                    <div className="home"></div>
                </div>
            );
        }
        return(
            <div className="App">
                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>Add Candidate</h1>
                    </div>
                </div>
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                
                <Form className="form">
                    <Form.Group as={Row}>
                        <Form.Label column sm="4" className="form-label">Enter Name</Form.Label>
                        <Col sm="8">
                            <Form.Control type="text" placeholder="Enter Name" className="form-input" value={this.state.name} onChange={this.updateName}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4" className="form-label">Enter Party Name</Form.Label>
                        <Col sm="8">
                            <Form.Control type="text" placeholder="Enter Party Name" className="form-input" value={this.state.party} onChange={this.updateParty}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4" className="form-label">Enter Manifesto</Form.Label>
                        <Col sm="8">
                            <Form.Control as="textarea" placeholder="Enter Manifesto" className="form-input" value={this.state.manifesto} onChange={this.updateManifesto}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}> 
                        <Form.Label column sm="4" className="form-label">Enter Constituency Number</Form.Label>
                        <Col sm="8">
                            <Form.Control type="text" placeholder="Enter Constituency Number" className="form-input" value={this.state.constituency} onChange={this.updateConstituency}/>
                        </Col>
                    </Form.Group>
                    <Button variant="secondary" size="lg" onClick={this.addCandidate} className="button-vote" block>Add</Button>
                </Form>
            </div>
        );
    }
} 

export default AddCandidate;