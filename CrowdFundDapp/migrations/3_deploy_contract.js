var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "COVID 19 Test campaign",
    10,
    10,
    "0x71070fC47bd3d15BD9c2FB15A395660be07CbCa7"
  );
};
