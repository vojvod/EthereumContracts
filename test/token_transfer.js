const ProofToken = artifacts.require('./ProofToken.sol');
const DevelodioToken = artifacts.require('./DevelodioToken.sol');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

let sender, dvl;

contract('token_transfer', async (accounts) => {

    let accountA, accountB, accountC, accountD;

    [accountA, accountB, accountC, accountD ] = accounts;

    beforeEach(async () => {
        sender = await ProofToken.new();
        dvl = await DevelodioToken.new();

        await sender.addNewToken('DVL', dvl.address);
    });

    it("should be able to transfer sender token to another wallet", async() => {
        let amount = new BigNumber(500000e5);

        await dvl.approve(sender.address, amount,{from: accountA});

        await sender.transferTokens('DVL',accountB, amount,{from: accountA});

        let balance = ((await  dvl.balanceOf(accountB)).toString());

        balance.should.equal(amount.toString())
    });

});