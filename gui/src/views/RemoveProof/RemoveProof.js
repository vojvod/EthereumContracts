import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Table} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";
import FileSaver from "file-saver";

class RemoveProof extends Component {
    constructor() {
        super();
        this.state = {
            fileOwnership: null,
            ownerID: null,
            fileHash: null,
            hasFile: false,
            fileIPFS: null,
            fileTypeIPFS: null,
            files: [],

            statsLoadFile: "",
            statsIconLoadFile: "",

            stats: "",
            statsIcon: ""
        }
    }

    onDrop(files) {
        let _this = this;
        this.setState({
            hasFile: false,
            fileHash: null,
            fileIPFS: null,
            fileTypeIPFS: null,
            files
        });

        let reader = new FileReader();
        reader.onload = function (event) {

            const file_result = this.result;
            const file_wordArr = CryptoJS.lib.WordArray.create(file_result);
            const hash = CryptoJS.SHA1(file_wordArr).toString();

            _this.setState({
                fileHash: hash
            });

            _this.createOwnersTable();

        };
        reader.readAsArrayBuffer(files[0]);

    }

    createOwnersTable() {
        let _this = this;
        _this.setState({
            statsIconLoadFile: "fa fa-spinner fa-spin",
            statsLoadFile: "Please wait..."
        });
        _this.props.blockchain.proofStoreContractInstance.methods.getFile(_this.state.fileHash).call({from: _this.props.blockchain.address[0]}).then(function (result) {
            _this.setState({
                statsIconLoadFile: "",
                statsLoadFile: ""
            });
            if (result.timestamp === "0") {
                _this.setState({
                    fileOwnership: <b>File is not register... Unknown ownership!</b>
                })
            } else {
                _this.setState({
                    statsIconLoadFile: "fa fa-exclamation",
                    statsLoadFile: "Owner with ID 0 is the main owner of the file!"
                });
                try {
                    _this.setState({
                        fileIPFS: result.ipfsHash,
                        fileTypeIPFS: result.ipfsFileType,
                        hasFile: true
                    });
                } catch (err) {
                }
                let mainOwner = {
                    fistName: result.firstname,
                    lastName: result.lastname,
                    email: result.email
                };
                if (result.ownerNumbers === "0") {
                    _this.setState({
                        fileOwnership: <Table bordered condensed hover>
                            <thead>
                            <tr>
                                <th colSpan="4" style={{textAlign: "center"}}>Owners</th>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>0</td>
                                <td>{mainOwner.fistName}</td>
                                <td>{mainOwner.lastName}</td>
                                <td>{mainOwner.email}</td>
                            </tr>
                            </tbody>
                        </Table>
                    })
                } else {
                    let owners = [];
                    let i = parseInt(result.ownerNumbers, 10);
                    for (let j = 1; j <= i; j++) {
                        _this.props.blockchain.proofStoreContractInstance.methods.getFileOwner(_this.state.fileHash, j).call({from: _this.props.blockchain.address[0]}).then(function (owner) {
                            owners.push({
                                id: j,
                                owner: owner
                            });
                            let rows = owners.reverse().map(value => {
                                return (
                                    <tr key={value.id}>
                                        <td>{value.id}</td>
                                        <td>{value.owner.ownerFirstName}</td>
                                        <td>{value.owner.ownerLastName}</td>
                                        <td>{value.owner.ownerEmail}</td>
                                    </tr>
                                )
                            });
                            _this.setState({
                                fileOwnership: <Table bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan="4" style={{textAlign: "center"}}>Owners</th>
                                    </tr>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>0</td>
                                        <td>{mainOwner.fistName}</td>
                                        <td>{mainOwner.lastName}</td>
                                        <td>{mainOwner.email}</td>
                                    </tr>
                                    {rows}
                                    </tbody>
                                </Table>
                            })
                        });
                    }
                }
            }

        });
    }

    submitTransaction() {
        let _this = this;
        if (this.state.fileHash === null || this.state.ownerID === null) {
            this.props.dashboard.notification.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        Please fill all the fields in the form!
                    </div>
                ),
                level: "error",
                position: "tr",
                autoDismiss: 15
            });
        } else {
            _this.props.blockchain.proofStoreContractInstance.methods.removeOwner(_this.state.fileHash, _this.state.ownerID).send({
                from: _this.props.blockchain.address[0],
                value: '1000'
            }).on('transactionHash', function (hash) {
                _this.setState({
                    statsIcon: "fa fa-spinner fa-spin",
                    stats: "Transaction Hash: " + hash.substring(0, 8) + "... Please wait for confirmation!"
                })
            }).on('receipt', function (receipt) {
                let url = "https://rinkeby.etherscan.io/tx/" + receipt.transactionHash;
                _this.setState({
                    statsIcon: "fa fa-exclamation",
                    stats: <a href={url} target="_blank" rel="noopener noreferrer">See the transaction on Etherscan.</a>

                });
            }).on('error', function (error) {
                _this.setState({
                    statsIcon: "",
                    stats: ""
                });
                _this.props.dashboard.notification.addNotification({
                    title: <span data-notify="icon" className="pe-7s-gift"/>,
                    message: (
                        <div>
                            File's owner was not removed!
                        </div>
                    ),
                    level: "error",
                    position: "tr",
                    autoDismiss: 15
                });
            }).then(function (result) {
                if (result.status === false) {
                    _this.props.dashboard.notification.addNotification({
                        title: <span data-notify="icon" className="pe-7s-gift"/>,
                        message: (
                            <div>
                                File's owner was not removed!
                            </div>
                        ),
                        level: "error",
                        position: "tr",
                        autoDismiss: 15
                    });
                }
                else if (result.status === true) {
                    _this.props.dashboard.notification.addNotification({
                        title: <span data-notify="icon" className="pe-7s-gift"/>,
                        message: (
                            <div>
                                File's owner was removed successfully!
                            </div>
                        ),
                        level: "success",
                        position: "tr",
                        autoDismiss: 15
                    });
                    _this.createOwnersTable();
                }
            });
        }
    }

    submitGetFile() {
        FileSaver.saveAs("https://ipfs.io/ipfs/" + this.state.fileIPFS, this.state.fileTypeIPFS);
    }

    render() {
        let _this = this;
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={6} xs={12}>
                            <Card
                                title="File Details"
                                category="Please select file"
                                stats={_this.state.statsLoadFile}
                                statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <form>
                                        <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}
                                                  style={{
                                                      borderWidth: "2px",
                                                      borderColor: "rgb(102, 102, 102)",
                                                      borderStyle: "dashed",
                                                      borderRadius: "5px",
                                                      textAlign: "center",
                                                      marginBottom: "20px",
                                                      height: "80px"
                                                  }}>
                                            {this.state.fileHash === null ?
                                                <p>Try dropping a file here, or click to select a file to
                                                    upload.</p> : ''}

                                            <ul style={{marginTop: "25px"}}>
                                                {
                                                    this.state.files.map(f => <li key={f.name}><b>{f.name}</b></li>)
                                                }
                                            </ul>
                                        </Dropzone>
                                        <div className="legend"
                                             style={{width: "100%"}}>
                                            {this.state.hasFile ?
                                                <Button bsStyle="info" style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}} pullLeft fill type="submit" onClick={e => this.submitGetFile()}>Get File</Button>
                                                : ''}
                                            {this.state.fileOwnership}
                                        </div>
                                        <div className="clearfix"/>
                                    </form>
                                }
                            />
                        </Col>

                        <Col md={6} xs={12}>
                            <Card
                                title="Owner Details"
                                category="Please select owner ID"
                                stats={_this.state.stats}
                                statsIcon={_this.state.statsIcon}
                                content={
                                    <form>
                                        <FormGroup>
                                            <ControlLabel>Owner ID</ControlLabel>
                                            <FormControl id="ownerID"
                                                         ref="ownerID"
                                                         label="Remove Owner with ID"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder="Enter owner ID"
                                                         onChange={e => _this.setState({
                                                             ownerID: e.target.value
                                                         })}
                                            />
                                        </FormGroup>
                                        <Button bsStyle="info" pullRight fill type="submit"
                                                onClick={e => this.submitTransaction()}>
                                            Remove Owner
                                        </Button>
                                        <div className="clearfix"/>
                                    </form>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    blockchain: state.blockchain,
    dashboard: state.dashboard
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

RemoveProof = connect(mapStateToProps, mapDispatchToProps)(RemoveProof);

export default RemoveProof;
