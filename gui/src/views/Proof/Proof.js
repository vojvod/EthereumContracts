import React, {Component} from "react";
import {Translate, getTranslate} from "react-localize-redux";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Table} from "react-bootstrap";
import Checkbox from "../../components/CustomCheckbox/CustomCheckbox";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";
import IPFS from "ipfs-api";

class Proof extends Component {
    constructor() {
        super();
        this.state = {
            node: new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'}),
            fileSize: 0,
            firstName: null,
            lastName: null,
            email: null,
            comments: null,
            fileHash: null,
            fileIPFS: false,
            fileTypeIPFS: null,
            files: [],
            stats: "",
            statsIcon: "",
            upload: false,

            transactionHash: "",
            txReceipt: false,
            blockNumber: ""

        }
    }

    // componentDidMount() {
    //     let node = new IPFS();
    //     node.once('start', () => {
    //         node.id()
    //             .then((id) => {
    //                 //console.log(id);
    //             })
    //             .catch((error) => console.log(error));
    //
    //     });
    //     this.setState({
    //         node: node
    //     })
    // }

    readFileContents(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsArrayBuffer(file)
        })
    }

    onDrop(files) {
        let _this = this;
        this.setState({
            fileHash: null,
            fileIPFS: false,
            fileTypeIPFS: null,
            files,
            transactionHash: "",
            txReceipt: false,
            blockNumber: ""
        });


        _this.readFileContents(files[0]).then((buffer) => {
            const file_result = buffer;
            const file_wordArr = CryptoJS.lib.WordArray.create(file_result);
            const hash = CryptoJS.SHA1(file_wordArr).toString();
            _this.setState({
                fileHash: hash
            });
            console.log(_this.state);
        });

        // let reader = new FileReader();
        // reader.onload = function (event) {
        //
        //     const file_result = this.result;
        //     const file_wordArr = CryptoJS.lib.WordArray.create(file_result);
        //     const hash = CryptoJS.SHA1(file_wordArr).toString();
        //
        //     _this.setState({
        //         fileHash: hash
        //     });
        //
        // };
        // reader.readAsArrayBuffer(files[0]);

    }

    submitTransaction() {
        let _this = this;
        _this.setState({
            transactionHash: "",
            txReceipt: false,
            blockNumber: ""
        });


        if (this.state.fileHash === null || this.state.lastName === null || this.state.email === null || this.state.fileHash === null || this.state.comments === null) {
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

            const updateProgress = (bytesLoaded) => {
                let percent = 100 - ((bytesLoaded / this.state.fileSize) * 100);
                let pr = 100 - percent;
                _this.setState({
                    statsIcon: "fa fa-spinner fa-spin",
                    stats: "Upload: " + pr.toFixed(0) + "%"

                });
            };

            _this.readFileContents(_this.state.files[0]).then((buffer) => {
                if (_this.state.upload) {

                    _this.setState({
                        fileSize: _this.state.files[0].size,
                        statsIcon: "fa fa-spinner fa-spin",
                        stats: <Translate id="general.uploadingFilePleaseWait"/>
                    });

                    _this.state.node.add(Buffer.from(buffer), (err, ipfsHash) => {

                        if (err) {
                            return console.log(err)
                        }

                        try {
                            _this.setState({
                                fileTypeIPFS: _this.state.files[0].name,
                                fileIPFS: ipfsHash[0].hash
                            });
                            _this.runContract(ipfsHash[0].hash, _this.state.files[0].name);
                        } catch (err) {
                            _this.setState({
                                statsIcon: "fa fa-exclamation",
                                stats: <Translate id="general.errorUploadingFile"/>

                            });
                        }

                    });


                    // _this.state.node.add({
                    //     path: _this.state.files[0].name,
                    //     content: Buffer.from(buffer)
                    // }, {wrap: true, progress: updateProgress}, (err, filesAdded) => {
                    //     if (err) {
                    //         return console.log(err)
                    //     }
                    //
                    //     console.log(filesAdded[1]);
                    //
                    //     try{
                    //         _this.setState({
                    //             fileTypeIPFS: filesAdded[1].path,
                    //             fileIPFS: filesAdded[1].hash
                    //         });
                    //         _this.runContract(filesAdded[1].hash, filesAdded[1].path);
                    //     }catch (err){}
                    //
                    // });

                } else {
                    _this.setState({
                        fileTypeIPFS: '',
                        fileIPFS: ''
                    });
                    console.log(_this.state);
                    _this.runContract('', '');
                }
            })

            // const node = new IPFS();
            //
            // let reader = new FileReader();
            // reader.onload = function (event) {
            //
            //     const file_result = this.result;
            //
            //     node.on('ready', async () => {
            //         const version = await node.version();
            //
            //         if (_this.state.upload) {
            //             const filesAdded = await node.files.add({
            //                 path: _this.state.files[0].name,
            //                 content: Buffer.from(file_result)
            //             });
            //             _this.setState({
            //                 fileTypeIPFS: filesAdded[0].path,
            //                 fileIPFS: filesAdded[0].hash
            //             });
            //             _this.runContract(filesAdded[0].hash, filesAdded[0].path);
            //         } else {
            //             _this.setState({
            //                 fileTypeIPFS: '',
            //                 fileIPFS: ''
            //             });
            //             console.log(_this.state);
            //             _this.runContract('', '');
            //         }
            //
            //     })
            // };
            // reader.readAsArrayBuffer(_this.state.files[0]);


        }
    }


    runContract(fIPSF, tIPFS) {
        let _this = this;
        _this.props.blockchain.proofStoreContractInstance.methods.setFile(_this.state.firstName, _this.state.lastName, _this.state.email, _this.state.fileHash, fIPSF, tIPFS, _this.state.comments).send({
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
                statsIcon: "fa fa-exclamation",
                stats: <a href={url} target="_blank" rel="noopener noreferrer"><Translate id="general.seeTransactionEthersacan"/></a>,
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
                        <Translate id="general.fileOwnerNotRegistered"/>
                    </div>
                ),
                level: "error",
                position: "tr",
                autoDismiss: 15
            });
        }).then(function (result) {
            if (result.events.logFileAddedStatus.returnValues.status === false) {
                _this.props.dashboard.notification.addNotification({
                    title: <span data-notify="icon" className="pe-7s-gift"/>,
                    message: (
                        <div>
                            <Translate id="general.fileNotRegistered"/>
                        </div>
                    ),
                    level: "error",
                    position: "tr",
                    autoDismiss: 15
                });
            }
            else if (result.events.logFileAddedStatus.returnValues.status === true) {
                _this.props.dashboard.notification.addNotification({
                    title: <span data-notify="icon" className="pe-7s-gift"/>,
                    message: (
                        <div>
                            <Translate id="general.fileRegisteredSuccess"/>
                        </div>
                    ),
                    level: "success",
                    position: "tr",
                    autoDismiss: 15
                });
                _this.setState({
                    firstName: null,
                    lastName: null,
                    email: null,
                    files: []
                })
            }
        });
    }

    getReceipt = async () => {

        try {
            this.setState({blockNumber: "waiting.."});
            this.setState({gasUsed: "waiting..."});

            await this.props.blockchain.web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
                console.log(err, txReceipt);
                this.setState({txReceipt});
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
                                category={<Translate id="general.pleaseFillFormBelowFileOwnerFetails"/>}
                                stats={_this.state.stats}
                                statsIcon={_this.state.statsIcon}
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

                                        <Checkbox number="uploadIPFS" isChecked={this.state.upload}
                                                  onClick={(e) => (_this.setState({upload: e.target.checked}))}
                                                  label={<Translate id="general.uploadFileIPFS"/>}/>

                                        <FormGroup>
                                            <ControlLabel><Translate id="general.owners.firstName"/></ControlLabel>
                                            <FormControl id="firstName"
                                                         ref="firstName"
                                                         label="First name"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder={_this.props.translate('general.enterFirstName')}
                                                         onChange={e => _this.setState({
                                                             firstName: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel><Translate id="general.owners.lastName"/></ControlLabel>
                                            <FormControl id="lastName"
                                                         ref="lastName"
                                                         label="Last name"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder={_this.props.translate('general.enterLastName')}
                                                         onChange={e => _this.setState({
                                                             lastName: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel><Translate id="general.emailAddress"/></ControlLabel>
                                            <FormControl id="email"
                                                         type="email"
                                                         label={<Translate id="general.emailAddress"/>}
                                                         bsClass="form-control"
                                                         placeholder={_this.props.translate('general.addEmailAddress')}
                                                         onChange={e => _this.setState({
                                                             email: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel><Translate id="general.comments"/></ControlLabel>
                                            <FormControl id="comments"
                                                         rows="5"
                                                         componentClass="textarea"
                                                         label={<Translate id="general.comments"/>}
                                                         bsClass="form-control"
                                                         placeholder={_this.props.translate('general.addcomments')}
                                                         onChange={e => _this.setState({
                                                             comments: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <Button bsStyle="info" pullRight fill type="submit"
                                                onClick={e => this.submitTransaction()}>
                                            <Translate id="general.addFile"/>
                                        </Button>
                                        <div className="clearfix"/>
                                    </form>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>

                        {this.state.txReceipt ?

                            <Col md={6} xs={12}>
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
                            </Col>

                            : ''
                        }

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

Proof = connect(mapStateToProps, mapDispatchToProps)(Proof);

export default Proof;
