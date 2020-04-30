const campaignAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address payable",
        "name": "projectStarter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contractName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "targetAmountEth",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "durationInMin",
        "type": "uint256"
      }
    ],
    "name": "CampaignStarted",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "beneficiary",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "fundingDeadline",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "internalType": "enum Campaign.State",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "targetAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "contractName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "targetAmountEth",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "durationInMin",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "beneficiaryAddress",
        "type": "address"
      }
    ],
    "name": "createCampaign",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "returnAllCampaigns",
    "outputs": [
      {
        "internalType": "contract CrowdFundingWithDeadline[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
  export default campaignAbi