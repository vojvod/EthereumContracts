const Proof = artifacts.require("./Proof.sol");

contract("Proof", accounts => {

    const firstOwnerAddress = accounts[0];
    const secondOwnerAddress = accounts[1];
    const thirdOwnerAddress = accounts[2];
    const externalAddress = accounts[3];

    const firstname = 'MyFirstName';
    const lastname = 'MyLastName';
    const email = 'Myemail';
    const fileHash = '0xdd870fa1b7c4700f2bd7f44238821c26f7392148';

    it('should revert the transaction of setFile if value is 0', () => {
        return Proof.deployed()
            .then(instance => {
                return instance.setFile(firstname, lastname, email, fileHash, {from: firstOwnerAddress, value: 0});
            })
            .then(result => {
                console.log(result);
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with no value");
            });
    });

    it('should revert the transaction of addOwner if sender is not the main file owner', () => {
        let proofInstance;
        return Proof.deployed()
            .then(instance => {
                proofInstance = instance;
                return instance.setFile(firstname, lastname, email, fileHash, {from: firstOwnerAddress, value: 10});
            })
            .then(setFileResult => {
                return proofInstance.addOwner(firstname, lastname, email, fileHash, {from: externalAddress, value: 10})
            })
            .then(result => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with invalid sender");
            });
    });

    it('should revert the transaction of removeOwner if sender is not the main file owner', () => {
        let proofInstance;
        return Proof.deployed()
            .then(instance => {
                proofInstance = instance;
                return instance.setFile(firstname, lastname, email, fileHash, {from: firstOwnerAddress, value: 10});
            })
            .then(setFileResult => {
                return proofInstance.addOwner(firstname, lastname, email, fileHash, {from: firstOwnerAddress, value: 10})
            })
            .then(addOwnerResult => {
                return proofInstance.addOwner(firstname, lastname, email, fileHash, {from: secondOwnerAddress, value: 10})
            })
            .then(addSecondOwnerResult => {
                return proofInstance.removeOwner(fileHash, 1, {from: externalAddress, value: 10})
            })
            .then(result => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with invalid sender");
            });
    });

});