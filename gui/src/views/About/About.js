import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import "../../assets/vendor/fontawesome-free/css/all.min.css";
import "../../assets/vendor/simple-line-icons/css/simple-line-icons.css";
import "../../assets/device-mockups/device-mockups.min.css";
import "../../assets/css/new-age.css";

class About extends Component {
    constructor() {
        super();
        this.state = {files: []}
    }


    render() {
        return (
            <div className="content" style={{padding: "10px 15px"}}>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <div id="page-top">
                                <section className="features" id="features" style={{padding: 0, margin: 0}}>
                                    <div className="container">
                                        <div className="section-heading text-center" style={{padding: 0, margin: 0}}>
                                            <h2>Blockchain-based File Ownership</h2>
                                            <p className="text-muted">We leverage blockchain technology to ensure the
                                                existence and ownership for your organization's files.</p>
                                            <hr/>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-1 my-auto"></div>
                                            <div className="col-lg-10 my-auto">
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/fileDetails"><i
                                                                    className="pe-7s-id"> </i></a>
                                                                <h3>File Details</h3>
                                                                <p className="text-muted">View the owners of a file!</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/addNewFile"><i
                                                                    className="pe-7s-mail-open-file"> </i></a>
                                                                <h3>Add New File</h3>
                                                                <p className="text-muted">Add a new file and it's
                                                                    owner!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/addOwner"><i className="pe-7s-add-user"> </i></a>
                                                                <h3>Add Owner</h3>
                                                                <p className="text-muted">Append a new owner in an
                                                                    existing file!</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/removeOwner"><i
                                                                    className="pe-7s-delete-user"> </i></a>
                                                                <h3>Remove Owner</h3>
                                                                <p className="text-muted">Remove an owner from an
                                                                    existing file!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-1 my-auto"></div>
                                        </div>
                                    </div>
                                </section>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h4 style={{color: "#3E50B1", fontWeight: "bold"}}>Integrity, Authenticity, Verifiability Through Ethereum Public Blockchain</h4>
                                        <p className="text-muted">It can also be seen as a tool to generate a Proof-of-Existence, Proof-of-Authenticity & Proof-of-Integrity of a file, record, document, certificate, degree on Blockchain.</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h4 style={{color: "#5A544F", fontWeight: "bold"}}>Open Public Blockchain For Record Keeping & Data Security</h4>
                                        <p className="text-muted">Powered by high-end Encryption & Blockchain Technology, Develodio allows you to create verifiable & immutable records of any types of data which are not possible in traditional technologies like MySQL, Oracle, MSSQL etc.</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h4 style={{color: "dc2430", fontWeight: "bold"}}>In Your Infrastructure - Under your Ownership</h4>
                                        <p className="text-muted">You will remain in the control of your own data. Since the whole system will be running in your own infrastructure & cloud your data will remain with you.</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default About;
