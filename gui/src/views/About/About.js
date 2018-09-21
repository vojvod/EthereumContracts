import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import {Card} from "../../components/Card/Card";

class About extends Component {
    constructor() {
        super();
        this.state = {files: []}
    }


    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="About"
                                ctAllIcons
                                category={<div>about ...</div>}
                                content={<div>about ...</div>}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default About;
