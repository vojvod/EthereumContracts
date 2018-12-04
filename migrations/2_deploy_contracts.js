var Proof = artifacts.require("./Proof.sol");
var DevelodioToken = artifacts.require("./DevelodioToken.sol");
var TokenProofSupport = artifacts.require("./TokenProofSupport.sol");
var ProofToken = artifacts.require("./ProofToken.sol");

module.exports = function(deployer) {
    deployer.deploy(Proof);
    deployer.deploy(DevelodioToken);
    deployer.deploy(TokenProofSupport);
    deployer.deploy(ProofToken);
};
