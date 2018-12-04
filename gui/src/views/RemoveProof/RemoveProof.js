import React, {Component} from "react";
import { Translate, getTranslate } from "react-localize-redux";
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
            fileComments: null,
            ownerID: null,
            fileHash: null,
            hasFile: false,
            fileIPFS: null,
            fileTypeIPFS: null,
            files: [],

            statsLoadFile: "",
            statsIconLoadFile: "",

            stats: "",
            statsIcon: "",

            transactionHash: "",
            txReceipt: false,
            blockNumber: ""
        }
    }

    onDrop(files) {
        let _this = this;
        this.setState({
            hasFile: false,
            fileHash: null,
            fileIPFS: null,
            fileTypeIPFS: null,
            files,
            transactionHash: "",
            txReceipt: false,
            blockNumber: "",
            fileComments: null,
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
            statsLoadFile: <div><Translate id="general.pleaseWait"/></div>
        });
        _this.props.blockchain.proofStoreContractInstance.methods.getFile(_this.state.fileHash).call({from: _this.props.blockchain.address[0]}).then(function (result) {
            _this.setState({
                statsIconLoadFile: "",
                statsLoadFile: ""
            });
            if (result.timestamp === "0") {
                _this.setState({
                    fileOwnership: <b style={{color: "red"}}><Translate id="general.fileNotRegisterUnknownOwnership"/></b>
                })
            } else {
                _this.setState({
                    statsIconLoadFile: "fa fa-exclamation",
                    statsLoadFile: <Translate id="general.owners.subTitle"/>
                });
                try {
                    if(result.ipfsHash !== '' && result.ipfsFileType !== ''){
                        _this.setState({
                            fileIPFS: result.ipfsHash,
                            fileTypeIPFS: result.ipfsFileType,
                            hasFile: true
                        });
                    }
                } catch (err) {
                }

                // Owners
                let mainOwner = {
                    address: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    comments: result.comments
                };
                let owners = [];

                _this.props.blockchain.proofStoreContractInstance.methods.getMainFileOwner(_this.state.fileHash).call({from: _this.props.blockchain.address[0]}).then(function (resultMainOwner) {
                    mainOwner = {
                        address: resultMainOwner.mainOwner,
                        firstName: resultMainOwner.firstname,
                        lastName: resultMainOwner.lastname,
                        email: resultMainOwner.email
                    };

                    if (result.ownerNumbers === "0") {
                        _this.setState({
                            fileOwnership: <Table bordered condensed hover>
                                <thead>
                                <tr>
                                    <th colSpan="4" style={{textAlign: "center"}}><Translate
                                        id="general.owners.owners"/></th>
                                </tr>
                                <tr>
                                    <th><Translate id="general.owners.id"/></th>
                                    <th><Translate id="general.owners.firstName"/></th>
                                    <th><Translate id="general.owners.lastName"/></th>
                                    <th><Translate id="general.owners.email"/></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>0</td>
                                    <td>{mainOwner.firstName}</td>
                                    <td>{mainOwner.lastName}</td>
                                    <td>{mainOwner.email}</td>
                                </tr>
                                </tbody>
                            </Table>,
                            fileComments: mainOwner.comments
                        })
                    } else {
                        let i = parseInt(result.ownerNumbers, 10);
                        for (let j = 1; j <= i; j++) {
                            _this.props.blockchain.proofStoreContractInstance.methods.getFileOwner(_this.state.fileHash, j).call({from: _this.props.blockchain.address[0]}).then(function (owner) {
                                owners.push({
                                    id: j,
                                    owner: owner
                                });
                                let rows = owners.map(value => {
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
                                            <th colSpan="4" style={{textAlign: "center"}}><Translate
                                                id="general.owners.owners"/></th>
                                        </tr>
                                        <tr>
                                            <th><Translate id="general.owners.id"/></th>
                                            <th><Translate id="general.owners.firstName"/></th>
                                            <th><Translate id="general.owners.lastName"/></th>
                                            <th><Translate id="general.owners.email"/></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>0</td>
                                            <td>{mainOwner.firstName}</td>
                                            <td>{mainOwner.lastName}</td>
                                            <td>{mainOwner.email}</td>
                                        </tr>
                                        {rows}
                                        </tbody>
                                    </Table>,
                                    fileComments: mainOwner.comments
                                })
                            });
                        }
                    }
                });
                // Owners END
            }

        });
    }

    submitTransaction() {
        let _this = this;
        _this.setState({
            transactionHash: "",
            txReceipt: false,
            blockNumber: ""
        });
        if (this.state.fileHash === null || this.state.ownerID === null) {
            this.props.dashboard.notification.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        <Translate id="general.pleaseFillAllFields"/>
                    </div>
                ),
                level: "error",
                position: "tr",
                autoDismiss: 15
            });
        } else {
            _this.props.blockchain.proofStoreContractInstance.methods.removeOwner(_this.state.fileHash, _this.state.ownerID).send({
                from: _this.props.blockchain.address[0],
                value: '5000000000000000'
            }).on('transactionHash', function (hash) {
                _this.setState({
                    statsIcon: "fa fa-spinner fa-spin",
                    stats: <div><Translate id="general.pleaseWaitConfirmation"/>{hash.substring(0, 8)}...</div>
                })
            }).on('receipt', function (receipt) {
                let url = "https://rinkeby.etherscan.io/tx/" + receipt.transactionHash;
                _this.setState({
                    // statsIcon: "fa fa-exclamation",
                    // stats: <a href={url} target="_blank" rel="noopener noreferrer">See the transaction on Etherscan.</a>,
                    transactionHash: receipt.transactionHash,
                    txReceipt: true,
                });
                _this.getReceipt();
            }).on('error', function (error) {
                _this.setState({
                    statsIcon: "",
                    stats: ""
                });
                _this.props.dashboard.notification.addNotification({
                    title: <span data-notify="icon" className="pe-7s-gift"/>,
                    message: (
                        <div>
                            <Translate id="general.ownerNotRemoved"/>
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
                                <Translate id="general.ownerNotRemoved"/>
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
                                <Translate id="general.ownerRemoved"/>
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

    getReceipt = async () => {
        let _this = this;
        try {
            this.setState({blockNumber: "waiting.."});
            this.setState({gasUsed: "waiting..."});

            await this.props.blockchain.web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
                console.log(err, txReceipt);
                let url = "https://rinkeby.etherscan.io/tx/" + _this.state.transactionHash;
                this.setState({
                    txReceipt,
                    statsIcon: "fa fa-exclamation",
                    stats: <a href={url} target="_blank" rel="noopener noreferrer"><Translate id="general.seeTransactionEthersacan"/></a>
                });
            });

            await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        }
        catch (error) {
            console.log(error);
        }
    };

    render() {
        let _this = this;
        return (
            <div className="content bkimg">
                <Grid fluid>
                    <Row>
                        <Col md={6} xs={12}>
                            <Card
                                title={<Translate id="general.fileDetails"/>}
                                // category={<Translate id="general.pleaseSelectAFile"/>}
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
                                                <p><Translate id="general.dropFile"/></p> : ''}

                                            <ul style={{marginTop: "25px"}}>
                                                {
                                                    this.state.files.map(f => <li key={f.name}><b>{f.name}</b></li>)
                                                }
                                            </ul>
                                        </Dropzone>
                                        <div className="legend"
                                             style={{width: "100%"}}>
                                            {this.state.hasFile ?
                                                <Button bsStyle="info" style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}} fill type="submit" onClick={e => this.submitGetFile()}><Translate id="general.getFile"/></Button>
                                                : ''}
                                            {this.state.fileOwnership}
                                            {this.state.fileComments !== '' ? this.state.fileComments : ''}
                                        </div>
                                        <div className="clearfix"/>
                                    </form>
                                }
                            />
                        </Col>

                        <Col md={6} xs={12}>
                            <Card
                                title={<Translate id="general.ownerDetails"/>}
                                category={<Translate id="general.PleaseSelectOwnerID"/>}
                                stats={_this.state.stats}
                                statsIcon={_this.state.statsIcon}
                                content={
                                    <form>
                                        <FormGroup>
                                            <ControlLabel><Translate id="general.ownerID"/></ControlLabel>
                                            <FormControl id="ownerID"
                                                         ref="ownerID"
                                                         label="Remove Owner with ID"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder={_this.props.translate('general.enterOwnerID')}
                                                         onChange={e => _this.setState({
                                                             ownerID: e.target.value
                                                         })}
                                            />
                                        </FormGroup>
                                        <Button bsStyle="info" pullRight fill type="submit"
                                                onClick={e => this.submitTransaction()}>
                                            <Translate id="sidebar.removeOwner"/>
                                        </Button>
                                        <div className="clearfix"/>
                                    </form>
                                }
                            />
                            {this.state.txReceipt ?
                                <Card
                                    title={<Translate id="general.transactionReceipt"/>}
                                    category=""
                                    stats={_this.state.stats}
                                    statsIcon={_this.state.statsIcon}
                                    content={
                                        <div>
                                            <Table bordered responsive style={{tableLayout: "fixed"}}>
                                                <thead>
                                                <tr>
                                                    <th><Translate id="general.txReceiptCategory"/></th>
                                                    <th><Translate id="general.fileReceipt.value"/></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td><Translate id="general.txHash"/></td>
                                                    <td style={{wordWrap: "break-word"}}>{this.state.transactionHash}</td>
                                                </tr>
                                                <tr>
                                                    <td><Translate id="general.blockNumber"/></td>
                                                    <td style={{wordWrap: "break-word"}}>{this.state.blockNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td><Translate id="general.fileHash"/></td>
                                                    <td style={{wordWrap: "break-word"}}>{this.state.fileHash}</td>
                                                </tr>
                                                {this.state.fileIPFS ?
                                                    <tr>
                                                        <td><Translate id="general.ipfsHash"/></td>
                                                        <td style={{wordWrap: "break-word"}}>{this.state.fileIPFS}</td>
                                                    </tr>
                                                    : ''
                                                }
                                                </tbody>
                                            </Table>
                                        </div>
                                    }
                                    legend={
                                        <div className="legend"></div>
                                    }
                                />
                                : ''
                            }
                        </Col>
                    </Row>

                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    blockchain: state.blockchain,
    dashboard: state.dashboard,
    translate: getTranslate(state.localize)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

RemoveProof = connect(mapStateToProps, mapDispatchToProps)(RemoveProof);

export default RemoveProof;
