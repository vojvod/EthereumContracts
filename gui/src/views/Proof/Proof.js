import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import {FormInputs} from "../../components/FormInputs/FormInputs";
import Button from "../../components/CustomButton/CustomButton";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Proof extends Component {
    constructor() {
        super();
        this.state = {files: []}
    }

    onDrop(files) {
        console.log(files);
        this.setState({
            files
        });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={6}>
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
                                        <FormInputs
                                            ncols={["col-md-6", "col-md-6"]}
                                            proprieties={[
                                                {
                                                    label: "First name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "First name",
                                                    defaultValue: "Mike"
                                                },
                                                {
                                                    label: "Last name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Last name",
                                                    defaultValue: "Andrew"
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-12"]}
                                            proprieties={[
                                                {
                                                    label: "Email address",
                                                    type: "email",
                                                    bsClass: "form-control",
                                                    placeholder: "Email"
                                                }
                                            ]}
                                        />
                                        <Button bsStyle="info" pullRight fill type="submit">
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);

Proof = connect(mapStateToProps, mapDispatchToProps)(Proof);

export default Proof;
