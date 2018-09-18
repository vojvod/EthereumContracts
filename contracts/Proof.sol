pragma solidity ^0.4.24;

contract Proof
{
    /*

    A Solidity contract that can prove file ownership without revealing the actual file.
    It can prove that the file existed at a particular time and finally check for document integrity.

    It achieves proof of ownership by storing the hash of the file and the owner's name as
    pairs. It achieves proof of existence by storing the hash of the file and the block
    timestamp as pairs. Finally, storing the hash itself proves the file integrity; that is, if the file
    was modified, then its hash will change and the contract won't be able to find any such file,
    therefore proving that the file was modified.

    */

    address private _owner;

    struct OwnerDetails
    {
        string firstname;
        string lastname;
        string email;
    }

    struct FileDetails
    {
        uint timestamp;
        OwnerDetails owner;
    }

    mapping(string => FileDetails) _files;

    modifier validOwner() {
        require(msg.sender == _owner);
        _;
    }

    event logFileAddedStatus(bool status, uint timestamp, string firstname, string lastname, string email, string fileHash);

    constructor() public {
        _owner = msg.sender;
    }

    function() public payable {}

    function withdraw(address to, uint amount) validOwner public {
        require(address(this).balance >= amount);
        to.transfer(amount);
    }

    // This is used to store the owner of file at the block timestamp
    function set(string firstname, string lastname, string email, string fileHash) public payable
    {
        require(msg.value > 0);

        // There is no proper way to check if a key already exists or not therefore we are checking for default value i.e., all bits are 0
        if (_files[fileHash].timestamp == 0)
        {

            _files[fileHash] = FileDetails(block.timestamp, OwnerDetails(firstname, lastname, email));
            // We are triggering an event so that the frontend of our app knows that the file's existence and ownership details have been stored
            emit logFileAddedStatus(true, block.timestamp, firstname, lastname, email, fileHash);
        }
        else
        {
            // This tells to the frontend that file's existence and ownership details couldn't be stored because the file's details had already been stored earlier
            emit logFileAddedStatus(false, block.timestamp, firstname, lastname, email, fileHash);
        }
    }

    // This is used to get file information
    function get(string fileHash) public constant returns (uint timestamp, string firstname, string lastname, string email)
    {
        return (_files[fileHash].timestamp, _files[fileHash].owner.firstname, _files[fileHash].owner.lastname, _files[fileHash].owner.email);
    }

}
