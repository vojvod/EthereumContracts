import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import Checkbox from "../../components/CustomCheckbox/CustomCheckbox";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";
import IPFS from "ipfs";
import FileSaver from "file-saver";

class Proof extends Component {
    constructor() {
        super();
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            fileHash: null,
            files: [],
            stats: "",
            statsIcon: "",
            upload: false
        }
    }

    onDrop(files) {
        let _this = this;
        this.setState({
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
        };
        reader.readAsArrayBuffer(files[0]);

    }

    uploadIPFS() {
        let _this = this;

        let reader = new FileReader();
        reader.onload = function (event) {

            const file_result = this.result;
            const node = new IPFS();

            node.on('ready', async () => {
                const version = await node.version();
                console.log('Version IPFS:', version.version);

                const filesAdded = await node.files.add({
                    path: _this.state.files[0].name,
                    content: Buffer.from(file_result)
                });

                console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
            })
        };
        reader.readAsArrayBuffer(_this.state.files[0]);
    }

    downloadIPFS() {
        let _this = this;


        FileSaver.saveAs("https://ipfs.io/ipfs/QmXLLos6QnkJyRheEzNc3YdrWxdVQoXqFjvRfme7FV5Mn2", "image.rar");

        // const link = document.createElement('a');
        // link.setAttribute('href', 'https://ipfs.io/ipfs/QmXLLos6QnkJyRheEzNc3YdrWxdVQoXqFjvRfme7FV5Mn2');
        // link.setAttribute('target', 'new');
        // link.setAttribute('download', 'test.rar');
        // link.innerHTML = 'test';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        // const node = new IPFS();

        // node.on('ready',  async () => {
        //
        //     const version = await node.version();
        //
        //     console.log('Version IPFS:', version.version);
        //
        //     // const fileBuffer = await node.files.cat('QmXLLos6QnkJyRheEzNc3YdrWxdVQoXqFjvRfme7FV5Mn2');
        //     const fileBuffer = await node.files.cat('Qmb1E7YpmnQYEqRKcr6WjTFgKubYkWtN4PzdwKp6Tud3TA');
        //
        //     console.log('Added file contents:', fileBuffer.toString())
        //
        //     // fs.writeFile(fileBuffer.toString(), 'myFile.pdf', (err) => {
        //     //     if(!err) console.log('Data written');
        //     // });
        //
        //
        // })


    }

    submitTransaction() {
        let _this = this;

        _this.downloadIPFS();

        // _this.uploadIPFS();

        /*if (this.state.fileHash === null || this.state.lastName === null || this.state.email === null || this.state.fileHash === null) {
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
            _this.props.blockchain.proofStoreContractInstance.methods.setFile(_this.state.firstName, _this.state.lastName, _this.state.email, _this.state.fileHash).send({
                from: _this.props.blockchain.address[0],
                value: '1000'
            }).on('transactionHash', function (hash) {
                _this.setState({
                    statsIcon: "fa fa-spinner fa-spin",
                    stats: "Transaction Hash: " + hash.substring(0,8) + "... Please wait for confirmation!"
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
                            File's owner not registered!
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
                                The file is already register!
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
                                The file is registered successfully!
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
                        fileHash: null,
                        files: []
                    })
                }
            });
        }*/
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
                                category="Please fill out the form below with the file's owner details"
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
                                                <p>Try dropping a file here, or click to select a file to
                                                    upload.</p> : ''}

                                            <ul style={{marginTop: "25px"}}>
                                                {
                                                    this.state.files.map(f => <li key={f.name}><b>{f.name}</b></li>)
                                                }
                                            </ul>
                                        </Dropzone>

                                        <Checkbox number="uploadIPFS" isChecked={this.state.upload} onClick={(e)=>(this.setState({load: e.target.checked}))} label="Upload File to IPFS"/>

                                        <FormGroup>
                                            <ControlLabel>First name</ControlLabel>
                                            <FormControl id="firstName"
                                                         ref="firstName"
                                                         label="First name"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder="Enter first name"
                                                         onChange={e => _this.setState({
                                                             firstName: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel>Last name</ControlLabel>
                                            <FormControl id="lastName"
                                                         ref="lastName"
                                                         label="Last name"
                                                         type="text"
                                                         bsClass="form-control"
                                                         placeholder="Enter last name"
                                                         onChange={e => _this.setState({
                                                             lastName: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel>Email addres</ControlLabel>
                                            <FormControl id="email"
                                                         type="email"
                                                         label="Email address"
                                                         bsClass="form-control"
                                                         placeholder="Enter email"
                                                         onChange={e => _this.setState({
                                                             email: e.target.value
                                                         })}
                                            />
                                        </FormGroup>

                                        <Button bsStyle="info" pullRight fill type="submit"
                                                onClick={e => this.submitTransaction()}>
                                            Add File
                                        </Button>
                                        <div className="clearfix"/>
                                    </form>
                                }
                                legend={
                                    <div className="legend"></div>
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

Proof = connect(mapStateToProps, mapDispatchToProps)(Proof);

export default Proof;
