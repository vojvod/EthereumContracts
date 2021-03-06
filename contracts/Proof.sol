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
        uint blockNumber;
        uint ownerNumbers;
        address mainOwner;
        string ipfsHash;
        string ipfsFileType;
        string comments;
    }

    mapping(string => FileDetails) _files;

    modifier validOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validValue() {
        require(msg.value >= 5000000000000000);
        _;
    }

    modifier validMainFileOwner(string fileHash) {
        require(msg.sender == _files[fileHash].mainOwner);
        _;
    }

    event logFileAddedStatus(bool status, uint timestamp, string firstname, string lastname, string email, string fileHash, string ipfsHash, string ipfsFileType);

    constructor() public {
        _owner = msg.sender;
    }

    function() public payable {}

    function withdraw(address to, uint amount) validOwner public {
        require(address(this).balance >= amount);
        to.transfer(amount);
    }

    function setFile(string firstname, string lastname, string email, string fileHash, string ipfsHash, string ipfsFileType, string comments) validValue public payable {
        if (_files[fileHash].timestamp == 0) {
            _owners[fileHash][0] = OwnerDetails(firstname, lastname, email);
            _files[fileHash] = FileDetails(block.timestamp, block.number, 0, msg.sender, ipfsHash, ipfsFileType, comments);
            emit logFileAddedStatus(true, block.timestamp, firstname, lastname, email, fileHash, ipfsHash, ipfsFileType);
        }
        else {
            emit logFileAddedStatus(false, block.timestamp, firstname, lastname, email, fileHash, ipfsHash, ipfsFileType);
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
            require(_files[fileHash].ownerNumbers >= ownerNumber);
            uint8 replace = 0;
            uint length = _files[fileHash].ownerNumbers;
            for(uint i = 0; i <= length; i++) {
                if (1 == replace) {
                    _owners[fileHash][i-1] = _owners[fileHash][i];
                } else if (keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].firstname)) == keccak256(abi.encodePacked(_owners[fileHash][i].firstname))
                && keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].lastname)) == keccak256(abi.encodePacked(_owners[fileHash][i].lastname))
                && keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].email)) == keccak256(abi.encodePacked(_owners[fileHash][i].email))) {
                    replace = 1;
                }
            }
            assert(replace == 1);
            delete _owners[fileHash][length];
            _files[fileHash].ownerNumbers--;
        }
    }

    function getFile(string fileHash) public constant returns (
        uint timestamp,
        uint blockNumber,
        //bytes32 blockHash,
        string ipfsHash,
        string ipfsFileType,
        uint ownerNumbers,
        string firstname,
        string lastname,
        string email,
        string comments)
    {
        FileDetails memory fileDetails = _files[fileHash];
        OwnerDetails memory ownerDetails = _owners[fileHash][0];
        return (
        fileDetails.timestamp,
        fileDetails.blockNumber,
        //blockhash(fileDetails.blockNumber),
        fileDetails.ipfsHash,
        fileDetails.ipfsFileType,
        fileDetails.ownerNumbers,
        ownerDetails.firstname,
        ownerDetails.lastname,
        ownerDetails.email,
        fileDetails.comments
        );
    }

    function getFileOwner(string fileHash, uint ownerNumber) public constant returns (
        string ownerFirstName,
        string ownerLastName,
        string ownerEmail) {
        return (
        _owners[fileHash][ownerNumber].firstname,
        _owners[fileHash][ownerNumber].lastname,
        _owners[fileHash][ownerNumber].email
        );
    }

}
