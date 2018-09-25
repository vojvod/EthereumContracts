import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";

class Proof extends Component {
    constructor() {
        super();
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            fileHash: null,
            files: []
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

    submitTransaction(){
        let _this = this;
        if(this.state.fileHash === null || this.state.lastName === null || this.state.email === null || this.state.fileHash === null){
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
        }else{
            _this.props.blockchain.proofStoreContractInstance.methods.setFile(_this.state.firstName,_this.state.lastName,_this.state.email,_this.state.fileHash).send({from: _this.props.blockchain.address[0], value: '1000'}).then(function(result){
                console.log(result);
                if(result.events.logFileAddedStatus.returnValues.status === false){
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
                else if(result.events.logFileAddedStatus.returnValues.status === true){
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
                                category="Please fill out the form below with the file's owner details"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
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
                                            {this.state.fileHash === null ? <p>Try dropping a file here, or click to select a file to
                                                upload.</p> : ''}

                                            <ul style={{marginTop: "25px"}}>
                                                {
                                                    this.state.files.map(f => <li key={f.name}><b>{f.name}</b></li>)
                                                }
                                            </ul>
                                        </Dropzone>

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

                                        <Button bsStyle="info" pullRight fill type="submit" onClick={e => this.submitTransaction()}>
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
