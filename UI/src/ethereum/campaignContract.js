import { web3 } from "./web3"
import campaignAbi from "./campaignAbi"

export function createContractCampaign(contractAddress) {
    return new web3.eth.Contract(campaignAbi, contractAddress)
}