var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "Research Funding : COVID-19",
    20,
    20,
    "0x75f2C2B33A85010EbB7C96146F632b49bD5F9522"
  );
};
