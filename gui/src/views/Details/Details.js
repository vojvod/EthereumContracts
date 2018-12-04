import React, {Component} from "react";
import {Translate, getTranslate} from "react-localize-redux";
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
            fileComments: null,
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
            fileComments: null,
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
                        fileOwnership: <b style={{color: "red"}}><Translate
                            id="general.fileNotRegisterUnknownOwnership"/></b>
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


                    // Owners
                    let mainOwner = {
                        address: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        comments: result.comments
                    };
                    let owners = [];

                    _this.props.blockchain.proofStoreContractInstance.methods.getMainFileOwner(_this.state.fileHash).call({from: _this.props.blockchain.address[0]}).then(function (resultMainOwner) {
                        mainOwner = {
                            address: resultMainOwner.mainOwner,
                            firstName: resultMainOwner.firstname,
                            lastName: resultMainOwner.lastname,
                            email: resultMainOwner.email
                        };

                        if (result.ownerNumbers === "0") {
                            _this.setState({
                                fileOwnership: <Table bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan="4" style={{textAlign: "center"}}><Translate
                                            id="general.owners.owners"/></th>
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
                                        <td>{mainOwner.firstName}</td>
                                        <td>{mainOwner.lastName}</td>
                                        <td>{mainOwner.email}</td>
                                    </tr>
                                    </tbody>
                                </Table>,
                                fileComments: mainOwner.comments
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
                                                <th colSpan="4" style={{textAlign: "center"}}><Translate
                                                    id="general.owners.owners"/></th>
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
                                                <td>{mainOwner.firstName}</td>
                                                <td>{mainOwner.lastName}</td>
                                                <td>{mainOwner.email}</td>
                                            </tr>
                                            {rows}
                                            </tbody>
                                        </Table>,
                                        fileComments: mainOwner.comments
                                    })
                                });
                            }
                        }
                    });
                    // Owners END


                    const getBlockHash = async () => {
                        const rs = await _this.props.blockchain.web3.eth.getBlock(result.blockNumber);
                        const bh = rs.hash;
                        rs.transactions.map(async (tx) => {
                            const txDetails = await _this.props.blockchain.web3.eth.getTransactionReceipt(tx);
                            // if (txDetails.to === _this.props.blockchain.proofStoreContractInstance._address.toLowerCase()) {
                                if (true) {
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
                                                        <th><Translate id="general.fileReceipt.fileReceiptCategory"/>
                                                        </th>
                                                        <th><Translate id="general.fileReceipt.value"/></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>Block Timestamp #</td>
                                                        <td style={{wordWrap: "break-word"}}>{new Date(result.timestamp * 1000).toLocaleString("el-EL")}</td>
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
                                                        <td style={{wordWrap: "break-word"}}>{mainOwner.address}</td>
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
                                                        style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}}
                                                        fill
                                                        type="submit"
                                                        onClick={e => _this.submitPrintFileReceipt(result, txDetails, owners, mainOwner)}><Translate
                                                    id="general.print"/></Button>
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

                }

            });
        }
    }

    submitGetFile() {
        console.log("https://ipfs.io/ipfs/" + this.state.fileIPFS);
        FileSaver.saveAs("https://ipfs.io/ipfs/" + this.state.fileIPFS, this.state.fileTypeIPFS);
    }

    submitPrintFileReceipt(a, b, c, e) {

        const _this = this;
        let s = _this.props.translate('general.print');


        const {vfs} = vfsFonts.pdfMake;
        pdfMake.vfs = vfs;

        let data = [
            [{text: _this.props.translate('general.owners.id'), style: 'tableHeader'},
                {text: _this.props.translate('general.owners.firstName'), style: 'tableHeader'},
                {text: _this.props.translate('general.owners.lastName'), style: 'tableHeader'},
                {text: _this.props.translate('general.owners.email'), style: 'tableHeader'}
            ],
            [
                {text: '0', style: 'tableRow'},
                {text: e.firstName, style: 'tableRow'},
                {text: e.lastName, style: 'tableRow'},
                {text: e.email, style: 'tableRow'}]
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
            watermark: {text: 'develodio', color: 'blue', opacity: 0.1, bold: true, italics: false},
            header: {
                columns: [
                    {text: _this.props.translate('about.title'), alignment: 'left', style: 'header'},
                    {text: 'http://proof.develodio.com', alignment: 'right', style: 'header'}
                ]
            },
            footer: function (currentPage, pageCount) {
                return {
                    columns: [
                        {text: _this.props.translate('general.pdf.5') + new Date().toLocaleString("el-EL"), alignment: 'left', style: 'footerLeft'},
                        {
                            text: _this.props.translate('general.pdf.6') + currentPage.toString() + _this.props.translate('general.pdf.7') + pageCount,
                            alignment: 'center',
                            style: 'footerCenter'
                        },
                        {text: 'http://proof.develodio.com', alignment: 'right', style: 'footerRight'}
                    ]
                };
            },
            content: [
                {canvas: [{type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1}]},
                {
                    text: _this.props.translate('general.pdf.1') + this.state.fileHash +
                    _this.props.translate('general.pdf.2') + e.address +
                    _this.props.translate('general.pdf.3') + new Date(a.timestamp * 1000).toLocaleString("el-EL") +
                    _this.props.translate('general.pdf.4') + e.firstName + " " + e.lastName + ".",
                    style: 'main'
                },
                {text: _this.props.translate('general.fileReceipt.fileReceipt'), style: 'tableTitle'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [125, 375],
                        body: [
                            [{text: _this.props.translate('general.fileReceipt.fileReceiptCategory'), style: 'tableHeader'}, {
                                text: _this.props.translate('general.fileReceipt.value'),
                                style: 'tableHeader'
                            }],
                            [{
                                text: "Block Timestamp #",
                                style: 'tableRow'
                            }, {text: new Date(a.timestamp * 1000).toLocaleString("el-EL"), style: 'tableRow'}],
                            [{text: "Block Number #", style: 'tableRow'}, {text: a.blockNumber, style: 'tableRow'}],
                            [{text: "Block Hash #", style: 'tableRow'}, {text: b.blockHash, style: 'tableRow'}],
                            [{text: "Transaction Hash #", style: 'tableRow'}, {
                                text: b.transactionHash,
                                style: 'tableRow'
                            }],
                            [{text: "From Address #", style: 'tableRow'}, {text: e.address, style: 'tableRow'}],
                            [{text: "File Hash #", style: 'tableRow'}, {text: this.state.fileHash, style: 'tableRow'}],
                            [{text: "File IPFS Hash #", style: 'tableRow'}, {text: a.ipfsHash, style: 'tableRow'}]
                        ]
                    }
                },
                {text: _this.props.translate('general.owners.owners'), style: 'tableTitle'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [30, 150, 150, 150],
                        body: data
                    }
                },
                {text: _this.props.translate('general.owners.subTitle'), style: 'comment'},
                {text: _this.props.translate('general.comments'), style: 'tableTitle'},
                {text: e.comments, style: 'paragraph'}
            ],
            styles: {
                header: {
                    italics: true,
                    margin: [40, 20, 40, 20],
                    fontSize: 10
                },
                footerLeft: {
                    italics: true,
                    margin: [40, 10, 0, 0],
                    fontSize: 10
                },
                footerCenter: {
                    italics: true,
                    margin: [0, 10, 0, 0],
                    fontSize: 10
                },
                footerRight: {
                    italics: true,
                    margin: [0, 10, 40, 0],
                    fontSize: 10
                },
                main: {
                    fontSize: 12,
                    margin: [0, 10, 0, 10]
                },
                paragraph: {
                    fontSize: 12,
                    margin: [0, 0, 0, 10]
                },
                tableTitle: {
                    fontSize: 14,
                    bold: false,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    fillColor: '#4CAF50',
                    bold: false,
                    fontSize: 12,
                    color: 'white'
                },
                tableRow: {
                    fontSize: 10
                },
                comment: {
                    italics: true,
                    fontSize: 10,
                    margin: [0, 0, 0, 10]
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };
        pdfMake.createPdf(docDefinition).download('develodio_' + a.timestamp + '.pdf');
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
                                        <div className="legend"
                                             style={{width: "100%"}}>
                                            {this.state.hasFile ?
                                                <Button bsStyle="info"
                                                        style={{marginBottom: "20px", marginLeft: "calc(50% - 50px)"}} fill
                                                        type="submit" onClick={e => this.submitGetFile()}><Translate
                                                    id="general.getFile"/></Button>
                                                : ''}
                                            {this.state.fileOwnership}
                                            {this.state.fileComments !== '' ? <p>{this.state.fileComments}</p> : ''}
                                        </div>
                                        <div className="clearfix"/>
                                    </form>
                                }
                                legend={
                                    <div className="legend"></div>
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
    dashboard: state.dashboard,
    translate: getTranslate(state.localize)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

Details = connect(mapStateToProps, mapDispatchToProps)(Details);

export default Details;
