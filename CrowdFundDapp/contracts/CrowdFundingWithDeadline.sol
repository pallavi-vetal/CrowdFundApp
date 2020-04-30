pragma solidity ^0.5.0;

import "./Utils.sol";

contract CrowdFundingWithDeadline {

    using Utils for *;

    enum State { Ongoing, Failed, Succeeded, PaidOut }

    event CampaignFinished(
        address addr,
        uint totalCollected,
        bool succeeded
    );

    string public name;
    uint public targetAmount;
    uint public fundingDeadline;
    address payable public beneficiary;
    address public owner;
    State public state;
    mapping(address => uint) public amounts;
    mapping(address => bool) public isContributed;
    bool public collected;
    uint public totalCollected;
    address[] public contributorList;
    uint[] public amountList;
    uint public totalContributors;
    modifier inState(State expectedState) {
        require(state == expectedState, "Invalid state");
        _;
    }

    constructor(
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address payable beneficiaryAddress
    )
        public
    {
        name = contractName;
        targetAmount = targetAmountEth;
        fundingDeadline = currentTime() +
            Utils.minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        owner = msg.sender;
        state = State.Ongoing;
    }
    
    function contribute() public payable inState(State.Ongoing) {
        require(beforeDeadline(), "No contributions after a deadline");
        if(amounts[msg.sender] == 0){
            contributorList.push(msg.sender);
            totalContributors += 1;
        }
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;

        if (totalCollected >= targetAmount) {
            collected = true;
            state = State.Succeeded;
        }
        //amountList[msg.sender] += msg.value;
    }
    function getContributors() public view returns(address[] memory){
        return contributorList;
    }
    function getAmountsList() public returns(uint[] memory){
        for (uint i = 0; i<contributorList.length; i++)
        {
            amountList.push(amounts[contributorList[i]]);
        }
        return amountList;
    }
    function finishCrowdFunding() public inState(State.Ongoing) {
        require(!beforeDeadline(), "Cannot finish campaign before a deadline");

        if (!collected) {
            state = State.Failed;
        } else {
            state = State.Succeeded;
        }

        emit CampaignFinished(address(this), totalCollected, collected);
    }
    function finishCrowdFundingBeforeDeadLine() public inState(State.Ongoing){
      collected = true;
        if (!collected) {
            state = State.Failed;
        } else {
            state = State.Succeeded;
        }
        emit CampaignFinished(address(this), totalCollected, collected);
    }
    function collect() public inState(State.Succeeded) {
        if (beneficiary.send(totalCollected)) {
            state = State.PaidOut;
        } else {
            state = State.Failed;
        }
    }

    function withdraw() public inState(State.Failed) {
        require(amounts[msg.sender] > 0, "Nothing was contributed");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if (!msg.sender.send(contributed)) {
            amounts[msg.sender] = contributed;
        }
    }

    function beforeDeadline() public view returns(bool) {
        return currentTime() < fundingDeadline;
    }

    function currentTime() internal view returns(uint) {
        return now;
    }

    function getTotalCollected() public view returns(uint) {
        return totalCollected;
    }

    function inProgress() public view returns (bool) {
        return state == State.Ongoing || state == State.Succeeded;
    }

    function isSuccessful() public view returns (bool) {
        return state == State.PaidOut;
    }
}