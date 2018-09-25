import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";

class RemoveProof extends Component {
    constructor() {
        super();
        this.state = {
            ownerID: null,
            fileHash: null,
            files: []
        }
    }

    onDrop(files) {
        let _this = this;
        this.setState({
            fileHash: null,
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
        if(this.state.fileHash === null || this.state.ownerID === null){
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
                                category="Please select file and the owner"
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
                                            <p>Try dropping a file here, or click to select a file to
                                                upload.</p>
                                            <ul>
                                                {
                                                    this.state.files.map(f => <li key={f.name}>{f.name}
                                                        - {f.size}
                                                        bytes</li>)
                                                }
                                            </ul>
                                        </Dropzone>

                                        <FormGroup>
                                            <ControlLabel>Last name</ControlLabel>
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
                                        <Button bsStyle="info" pullRight fill type="submit" onClick={e => this.submitTransaction()}>
                                            Remove Owner
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

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);

RemoveProof = connect(mapStateToProps, mapDispatchToProps)(RemoveProof);

export default RemoveProof;
