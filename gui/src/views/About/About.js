import React, {Component} from "react";
import { Translate } from "react-localize-redux";
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
            <div className="content bkimg" style={{padding: "10px 15px"}}>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <div id="page-top">
                                <section className="features" id="features" style={{padding: 0, margin: 0}}>
                                    <div className="container">
                                        <div className="section-heading text-center" style={{padding: 0, margin: 0}}>
                                            <h2><Translate id="about.title"/></h2>
                                            <p className="text-muted"><Translate id="about.sub_title"/></p>
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
                                                                <h3><Translate id="about.file_details"/></h3>
                                                                <p className="text-muted"><Translate id="about.view_owners"/></p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/addNewFile"><i
                                                                    className="pe-7s-mail-open-file"> </i></a>
                                                                <h3><Translate id="about.add_new_file"/></h3>
                                                                <p className="text-muted"><Translate id="about.sub_add_new_file"/></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/addOwner"><i className="pe-7s-add-user"> </i></a>
                                                                <h3><Translate id="about.add_owner"/></h3>
                                                                <p className="text-muted"><Translate id="about.sub_add_owner"/></p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <a href="#/removeOwner"><i
                                                                    className="pe-7s-delete-user"> </i></a>
                                                                <h3><Translate id="about.remove_owner"/></h3>
                                                                <p className="text-muted"><Translate id="about.sub_remove_owner"/></p>
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
                                        <h4 style={{color: "#3E50B1", fontWeight: "bold"}}><Translate id="about.col1_title"/></h4>
                                        <p className="text-muted"><Translate id="about.col1_text"/></p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h4 style={{color: "#5A544F", fontWeight: "bold"}}><Translate id="about.col2_title"/></h4>
                                        <p className="text-muted"><Translate id="about.col2_text"/></p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h4 style={{color: "dc2430", fontWeight: "bold"}}><Translate id="about.col3_title"/></h4>
                                        <p className="text-muted"><Translate id="about.col3_text"/></p>
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
