import React, {Component} from "react";
import { Translate } from "react-localize-redux";
import {Grid, Row, Col, Table} from "react-bootstrap";
import Button from "../../components/CustomButton/CustomButton";
import Dropzone from "react-dropzone";
import {Card} from "../../components/Card/Card";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";
import FileSaver from "file-saver";
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

class Details extends Component {
    constructor() {
        super();
        this.state = {
            fileOwnership: null,
            fileHash: null,
            files: [],
            statsLoadFile: "",
            statsIconLoadFile: "",
            hasFile: false,
            fileIPFS: null,
            fileTypeIPFS: null,
            fileOwnershipΡeceipt: null
        }
    }

    onDrop(files) {
        let _this = this;
        this.setState({
            fileOwnership: null,
            fileOwnershipΡeceipt: null,
            fileHash: null,
            hasFile: false,
            fileIPFS: null,
            fileTypeIPFS: null,
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

            _this.submitTransaction();
        };
        reader.readAsArrayBuffer(files[0]);

    }

    submitTransaction() {
        let _this = this;
        if (this.state.fileHash === null) {
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
            _this.setState({
                statsIconLoadFile: "fa fa-spinner fa-spin",
                statsLoadFile: <Translate id="general.pleaseWait"/>
            });
            this.props.blockchain.proofStoreContractInstance.methods.getFile(this.state.fileHash).call({from: this.props.blockchain.address[0]}).then(function (result) {
                _this.setState({
                    statsIconLoadFile: "",
                    statsLoadFile: ""
                });
                if (result.timestamp === "0") {
                    _this.setState({
                        fileOwnership: <b style={{color: "red"}}><Translate id="general.fileNotRegisterUnknownOwnership"/></b>
                    })
                } else {
                    try {
                        if (result.ipfsHash !== '' && result.ipfsFileType !== '') {
                            _this.setState({
                                fileIPFS: result.ipfsHash,
                                fileTypeIPFS: result.ipfsFileType,
                                hasFile: true
                            });
                        }
                    } catch (err) {
                    }

                    let owners = [];
                    const getBlockHash  = async () => {
                        const rs = await _this.props.blockchain.web3.eth.getBlock(result.blockNumber);
                        const bh = rs.hash;
                        rs.transactions.map(async (tx) => {
                            const txDetails = await _this.props.blockchain.web3.eth.getTransactionReceipt(tx);
                            if(txDetails.to === _this.props.blockchain.proofStoreContractInstance._address.toLowerCase() ){
                                _this.setState({
                                    statsIconLoadFile: "fa fa-exclamation",
                                    statsLoadFile: <Translate id="general.owners.subTitle"/>,
                                    fileOwnershipΡeceipt: <Card
                                        title={<Translate id="general.fileReceipt.fileReceipt"/>}
                                        category=""
                                        stats={_this.state.stats}
                                        statsIcon={_this.state.statsIcon}
                                        content={
                                            <div>
                                                <Table bordered responsive style={{tableLayout: "fixed"}}>
                                                    <thead>
                                                    <tr>
                                                        <th><Translate id="general.fileReceipt.fileReceiptCategory"/></th>
                                                        <th><Translate id="general.fileReceipt.value"/></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>Block Timestamp #</td>
                                                        <td style={{wordWrap: "break-word"}}>{new Date(result.timestamp*1000).toLocaleString("el-EL")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block Number #</td>
                                                        <td style={{wordWrap: "break-word"}}>{result.blockNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block Hash #</td>
                                                        <td style={{wordWrap: "break-word"}}>{bh}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Transaction Hash #</td>
                                                        <td style={{wordWrap: "break-word"}}>{txDetails.transactionHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>From Address #</td>
                                                        <td style={{wordWrap: "break-word"}}>{txDetails.from}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>File Hash #</td>
                                                        <td style={{wordWrap: "break-word"}}>{_this.state.fileHash}</td>
                                                    </tr>
                                                    {
                                                        _this.state.hasFile ?
                                                            <tr>
                                                                <td>File IPFS Hash #</td>
                                                                <td style={{wordWrap: "break-word"}}>{result.ipfsHash}</td>
                                                            </tr>
                                                            :
                                                            ''
                                                    }
                                                    </tbody>
                                                </Table>
                                                <Button bsStyle="info"
                                                        style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}} fill
                                                        type="submit" onClick={e => _this.submitPrintFileReceipt(result, txDetails, owners)}><Translate id="general.print"/></Button>
                                            </div>
                                        }
                                        legend={
                                            <div className="legend"></div>
                                        }
                                    />
                                });

                            }
                        });
                    };
                    getBlockHash();

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
                                    <th colSpan="4" style={{textAlign: "center"}}><Translate id="general.owners.owners"/></th>
                                </tr>
                                <tr>
                                    <th><Translate id="general.owners.id"/></th>
                                    <th><Translate id="general.owners.firstName"/></th>
                                    <th><Translate id="general.owners.lastName"/></th>
                                    <th><Translate id="general.owners.email"/></th>
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
                        let i = parseInt(result.ownerNumbers, 10);
                        for (let j = 1; j <= i; j++) {
                            _this.props.blockchain.proofStoreContractInstance.methods.getFileOwner(_this.state.fileHash, j).call({from: _this.props.blockchain.address[0]}).then(function (owner) {
                                owners.push({
                                    id: j,
                                    owner: owner
                                });
                                let rows = owners.map(value => {
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
                                            <th colSpan="4" style={{textAlign: "center"}}><Translate id="general.owners.owners"/></th>
                                        </tr>
                                        <tr>
                                            <th><Translate id="general.owners.id"/></th>
                                            <th><Translate id="general.owners.firstName"/></th>
                                            <th><Translate id="general.owners.lastName"/></th>
                                            <th><Translate id="general.owners.email"/></th>
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
    }

    submitGetFile() {
        console.log("https://ipfs.io/ipfs/" + this.state.fileIPFS);
        FileSaver.saveAs("https://ipfs.io/ipfs/" + this.state.fileIPFS, this.state.fileTypeIPFS);
    }

    submitPrintFileReceipt(a, b, c){

        const {vfs} = vfsFonts.pdfMake;
        pdfMake.vfs = vfs;

        let data = [
            [   {text: 'ID', style: 'tableHeader'},
                {text: 'First Name', style: 'tableHeader'},
                {text: 'Last Name', style: 'tableHeader'},
                {text: 'e-mail', style: 'tableHeader'}
            ],
            [
                {text: '0', style: 'tableRow'},
                {text: a.firstname, style: 'tableRow'},
                {text: a.lastname, style: 'tableRow'},
                {text: a.email, style: 'tableRow'}]
        ];
        c.map(value => {
            data.push([
                {text: value.id, style: 'tableRow'},
                {text: value.owner.ownerFirstName, style: 'tableRow'},
                {text: value.owner.ownerLastName, style: 'tableRow'},
                {text: value.owner.ownerEmail, style: 'tableRow'}
            ]);
        });

        let docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            header: {
                columns: [
                    { text: 'http://proof.develodio.com', alignment: 'left', style:'header' }
                ]
            },
            footer: {
                columns: [
                    { text: 'Right part', alignment: 'left', style:'footer' }
                ]
            },
            content: [
                {text: "File's Receipt", style: 'tableTitle'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [125, 375],
                        body: [
                            [{text: 'File Receipt Category', style: 'tableHeader'},{text: 'Value', style: 'tableHeader'}],
                            [{text: "Block Timestamp #", style: 'tableRow'}, {text: new Date(a.timestamp*1000).toLocaleString("el-EL"), style: 'tableRow'}],
                            [{text: "Block Number #", style: 'tableRow'}, {text: a.blockNumber, style: 'tableRow'}],
                            [{text: "Block Hash #", style: 'tableRow'}, {text: b.blockHash, style: 'tableRow'}],
                            [{text: "Transaction Hash #", style: 'tableRow'}, {text: b.transactionHash, style: 'tableRow'}],
                            [{text: "From Address #", style: 'tableRow'}, {text: b.from, style: 'tableRow'} ],
                            [{text: "File Hash #", style: 'tableRow'}, {text: this.state.fileHash, style: 'tableRow'}],
                            [{text: "File IPFS Hash #", style: 'tableRow'}, {text: a.ipfsHash, style: 'tableRow'}]
                        ]
                    }
                },
                {text: "File's Owner", style: 'tableTitle'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [30, 150, 150, 150],
                        body: data
                    }
                },
                { text: '*Owner with ID 0 is the main owner of the file!', style:'comment' }
            ],
            styles: {
                header: {
                    italics: true,
                    margin: [20, 20, 20, 20],
                    fontSize: 10
                },
                footer: {
                    italics: true,
                    margin: [20, 20, 20, 20],
                    fontSize: 10
                },
                tableTitle: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    fillColor: '#4CAF50',
                    bold: true,
                    fontSize: 12,
                    color: 'white'
                },
                tableRow: {
                    fontSize: 10
                },
                comment: {
                    italics: true,
                    fontSize: 10
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };
        pdfMake.createPdf(docDefinition).download();
    }

    render() {
        let _this = this;
        return (
            <div className="content bkimg">
                <Grid fluid>
                    <Row>
                        <Col md={6} xs={12}>
                            <Card
                                title={<Translate id="general.fileOwnership"/>}
                                // category={<Translate id="general.pleaseSelectAFile"/>}
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
                                                <p><Translate id="general.dropFile"/></p> : ''}

                                            <ul style={{marginTop: "25px"}}>
                                                {
                                                    this.state.files.map(f => <li key={f.name}><b>{f.name}</b></li>)
                                                }
                                            </ul>
                                        </Dropzone>
                                        <div className="clearfix"/>
                                    </form>
                                }
                                legend={
                                    <div className="legend"
                                         style={{width: "100%"}}>
                                        {this.state.hasFile ?
                                            <Button bsStyle="info"
                                                    style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}} fill
                                                    type="submit" onClick={e => this.submitGetFile()}><Translate id="general.getFile"/></Button>
                                            : ''}
                                        {this.state.fileOwnership}
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={6} xs={12}>
                            {this.state.fileOwnershipΡeceipt}
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

Details = connect(mapStateToProps, mapDispatchToProps)(Details);

export default Details;
