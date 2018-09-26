import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Table} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";

class AddProof extends Component {
    constructor() {
        super();
        this.state = {
            fileOwnership: null,
            firstName: null,
            lastName: null,
            email: null,
            fileHash: null,
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
        if (this.state.fileHash === null || this.state.lastName === null || this.state.email === null || this.state.fileHash === null) {
            console.log(this.props.dashboard.notification);
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
            _this.props.blockchain.proofStoreContractInstance.methods.addOwner(_this.state.firstName, _this.state.lastName, _this.state.email, _this.state.fileHash).send({
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
                if (result.status === false) {
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
                }
                else if (result.status === true) {
                    _this.props.dashboard.notification.addNotification({
                        title: <span data-notify="icon" className="pe-7s-gift"/>,
                        message: (
                            <div>
                                File's Owner is registered successfully!
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

    render() {
        let _this = this;
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={6} xs={12}>
                            <Card
                                title="File Details"
                                category="Please fill out the form below with the new file's owner details"
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
                                        <div className="legend" style={{width: "100%"}}>{this.state.fileOwnership}</div>
                                        <div className="clearfix"/>
                                    </form>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>

                        <Col md={6} xs={12}>
                            <Card
                                title="New Owner"
                                category="Please fill out the form below with the new file's owner details"
                                stats={_this.state.stats}
                                statsIcon={_this.state.statsIcon}
                                content={
                                    <form>
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
                                            Add Owner
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

AddProof = connect(mapStateToProps, mapDispatchToProps)(AddProof);

export default AddProof;
