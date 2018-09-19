pragma solidity ^0.4.24;

contract Proof
{
    address private _owner;

    struct OwnerDetails {
        string firstname;
        string lastname;
        string email;
    }

    mapping(string => mapping(uint => OwnerDetails)) _owners;

    struct FileDetails {
        uint timestamp;
        uint ownerNumbers;
        address mainOwner;
    }

    mapping(string => FileDetails) _files;

    modifier validOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validValue() {
        require(msg.value > 0);
        _;
    }

    modifier validMainFileOwner(string fileHash) {
        require(msg.sender == _files[fileHash].mainOwner);
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

    function setFile(string firstname, string lastname, string email, string fileHash) validValue public payable {
        if (_files[fileHash].timestamp == 0) {
            _owners[fileHash][0] = OwnerDetails(firstname, lastname, email);
            _files[fileHash] = FileDetails(block.timestamp, 0, msg.sender);
            emit logFileAddedStatus(true, block.timestamp, firstname, lastname, email, fileHash);
        }
        else {
            emit logFileAddedStatus(false, block.timestamp, firstname, lastname, email, fileHash);
        }
    }

    function addOwner(string firstname, string lastname, string email, string fileHash) validValue validMainFileOwner(fileHash) public payable {
        if (_files[fileHash].timestamp != 0) {
            _files[fileHash].ownerNumbers++;
            _owners[fileHash][_files[fileHash].ownerNumbers] = OwnerDetails(firstname, lastname, email);
        }
    }

    function removeOwner(string fileHash, uint ownerNumber) validValue validMainFileOwner(fileHash) public payable {
        require(ownerNumber > 0);
        if (_files[fileHash].timestamp != 0) {
            _files[fileHash].ownerNumbers--;
            delete _owners[fileHash][ownerNumber];
        }
    }

    function getFile(string fileHash) public constant returns (uint timestamp, uint ownerNumbers, string firstname, string lastname, string email) {
        return (_files[fileHash].timestamp, _files[fileHash].ownerNumbers, _owners[fileHash][0].firstname, _owners[fileHash][0].lastname, _owners[fileHash][0].email);
    }

    function getFileOwner(string fileHash, uint ownerNumber) public constant returns (string ownerFirstName, string ownerLastName, string ownerEmail) {
        return (_owners[fileHash][ownerNumber].firstname, _owners[fileHash][ownerNumber].lastname, _owners[fileHash][ownerNumber].email);
    }

}
