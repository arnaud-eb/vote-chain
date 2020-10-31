// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract VoteChain {
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    struct Candidate {
        string name;
        string party;
        string manifesto;
        uint voteCount;
        uint constituency;
        uint candidateId;
    }

    mapping(uint => Candidate) public candidateDetails;

    struct Voter {
        address voterAddress;
        string name;
        string aadhar;
        uint constituency;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;

    mapping(address => Voter) public voterDetails;

    modifier onlyAdmin() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function addCandidate(string memory _name, string memory _party, string memory _manifesto, uint _constituency) public onlyAdmin {
        candidateDetails[candidateCount] = Candidate(_name, _party, _manifesto, 0, _constituency, candidateCount);
        candidateCount++;
    }

    function getCandidateNumber() public view returns(uint) {
        return candidateCount;
    }

    function requestVoter(string memory _name, string memory _aadhar, uint _constituency) public {
        voterDetails[msg.sender] = Voter(msg.sender, _name, _aadhar, _constituency, false, false);
        voters.push(msg.sender);
        voterCount++;
    }

    function getVoterCount() public view returns(uint) {
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function vote(uint _candidateId) public {
        require(voterDetails[msg.sender].hasVoted == false, "Voter has already voted!");
        require(voterDetails[msg.sender].isVerified == true, "Voter has not been verifed yet.");
        require(start == true, "The vote is over.");
        require(end == false, "The vote is over.");
        candidateDetails[_candidateId].voteCount++;
        voterDetails[msg.sender].hasVoted = true;
    }

    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        start = false;
        end = true;
    }

    function getStart() public view returns(bool) {
        return start;
    }

    function getEnd() public view returns(bool) {
        return end;
    }
}