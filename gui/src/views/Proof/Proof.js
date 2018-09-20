import React, {Component} from "react";
import {Grid} from "react-bootstrap";
import Dropzone from "react-dropzone";

class Proof extends Component {
    constructor() {
        super()
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
                    <section>
                        <div className="dropzone">
                            <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}
                                      style={{
                                          position: "relative",
                                          minHeight: "80px",
                                          borderWidth: "2px",
                                          borderColor: "rgb(102, 102, 102)",
                                          borderStyle: "dashed",
                                          borderRadius: "5px",
                                          textAlign: "center"
                                      }}>
                                <p>Try dropping a file here, or click to select a file to upload.</p>
                                <ul>
                                    {
                                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                                    }
                                </ul>
                            </Dropzone>
                        </div>
                    </section>
                </Grid>
            </div>
        )
    }
}

export default Proof;
