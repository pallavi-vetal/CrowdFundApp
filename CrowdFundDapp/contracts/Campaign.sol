pragma solidity ^0.5.0;
import "./CrowdFundingWithDeadline.sol";
import "./Utils.sol";
contract Campaign {
    enum State { Ongoing, Failed, Succeeded, PaidOut }

     event CampaignStarted(
         address contractAddress,
        address payable projectStarter,
        string  contractName,
        uint targetAmountEth,
        uint durationInMin
    );
    string public name;
    uint public targetAmount;
    uint public fundingDeadline;
    address payable public beneficiary;
    address public owner;
    State public state;
    CrowdFundingWithDeadline[] campaign;
function createCampaign(string calldata contractName,uint targetAmountEth,uint durationInMin,
address  payable beneficiaryAddress) external payable{
        name = contractName;
        targetAmount = Utils.etherToWei(targetAmountEth);
        fundingDeadline = now +
            Utils.minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        owner = msg.sender;
        state = State.Ongoing;
        CrowdFundingWithDeadline newCampaign = new CrowdFundingWithDeadline(name, targetAmount,fundingDeadline , beneficiary);
        campaign.push(newCampaign);
        emit CampaignStarted(
            owner,
            beneficiary,
            name,
            targetAmount,
            fundingDeadline
        );
}
function returnAllCampaigns() external view returns(CrowdFundingWithDeadline[] memory){
        return campaign;
    }
}