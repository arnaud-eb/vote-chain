import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class Navigation extends Component {
    render() {
        return(
            <Navbar bg="dark" variant="dark" className="navbar">
                <Navbar.Brand><Link to="/" className="tab">HOME</Link></Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link><Link to="/CandidateDetails" className="tab">CANDIDATES</Link></Nav.Link>
                    <Nav.Link><Link to="/RequestVoter" className="tab">APPLY FOR VOTER</Link></Nav.Link>
                    <Nav.Link><Link to="/Vote" className="tab">VOTE</Link></Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

export default Navigation;