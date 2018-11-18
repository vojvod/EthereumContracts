var Proof = artifacts.require("./Proof.sol");
var ERC20 = artifacts.require("./ERC20.sol");
var ERC223 = artifacts.require("./ERC223.sol");
var ERC223ReceivingContract = artifacts.require("./ERC223ReceivingContract.sol");
var Token = artifacts.require("./Token.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var DevelodioToken = artifacts.require("./DevelodioToken.sol");

module.exports = function(deployer) {
    deployer.deploy(Proof);
    deployer.deploy(ERC20);
    deployer.deploy(ERC223);
    deployer.deploy(ERC223ReceivingContract);
    deployer.deploy(Token);
    deployer.deploy(SafeMath);
    deployer.deploy(DevelodioToken);
};
