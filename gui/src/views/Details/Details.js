import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import {FormInputs} from "../../components/FormInputs/FormInputs";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";

class Details extends Component {
    constructor() {
        super();
        this.state = {files: []}
    }

    onDrop(files) {
        this.setState({
            files
        });

        let reader = new FileReader();
        reader.onload = function (event) {

            const file_result = this.result;
            const file_wordArr = CryptoJS.lib.WordArray.create(file_result);
            const hash = CryptoJS.SHA1(file_wordArr).toString();

            console.log(hash);

        };
        reader.readAsArrayBuffer(files[0]);

    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={6}>
                            <Card
                                title="File Ownership"
                                category="Please select file"
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

                                        <Button bsStyle="info" pullRight fill type="submit">
                                            Get Proof of File Ownership
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);

Details = connect(mapStateToProps, mapDispatchToProps)(Details);

export default Details;
