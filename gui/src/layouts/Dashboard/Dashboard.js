import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import NotificationSystem from "react-notification-system";
import AnimateCanvas from "../../components/AnimateCanvas/AnimateCanvas";

import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize, Translate } from "react-localize-redux";
import globalTranslations from "../../translations/global.json";

import TopInfo from "../../components/TopInfo/TopInfo";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import EthereumLogo from "../../assets/img/ethereum.png";
import IPSFLogo from "../../assets/img/ipfs.png";

import {style} from "../../variables/Variables";

import dashboardRoutes from "../../routes/dashboard";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setNotificationInstance} from '../../ducks/dashboard';
import {setProofStoreContractInstance, setWeb3Instance, setAddressInstance} from '../../ducks/blockchain';

import getWeb3 from '../../utils/getWeb3';
import ProofContract from "../../contracts/Proof.json";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleNotificationClick = this.handleNotificationClick.bind(this);
        this.state = {
            _notificationSystem: null,
            accounts: []
        };
        this.props.initialize({
            languages: [
                { name: "English", code: "en" },
                { name: "Greek", code: "el" }
            ],
            translation: globalTranslations,
            options: { renderToStaticMarkup }
        });
    }

    handleNotificationClick(position) {
        let color = Math.floor(Math.random() * 4 + 1);
        let level;
        switch (color) {
            case 1:
                level = "success";
                break;
            case 2:
                level = "warning";
                break;
            case 3:
                level = "error";
                break;
            case 4:
                level = "info";
                break;
            default:
                break;
        }
        this.state._notificationSystem.addNotification({
            title: <span data-notify="icon" className="pe-7s-gift"/>,
            message: (
                <div><Translate id="dashboard.welcome"/></div>
            ),
            level: level,
            position: position,
            autoDismiss: 15
        });
    }

    componentDidMount = async () => {
        this.setState({_notificationSystem: this.refs.notificationSystem});
        let _notificationSystem = this.refs.notificationSystem;

        this.props.setNotificationInstance({
            notification: _notificationSystem
        });

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const instanceContract = new web3.eth.Contract(ProofContract, '0x4592621a7a847a5885d1c947710b669f9f84eaf2');

            web3.eth.currentProvider.publicConfigStore.on('update', function () {
                web3.eth.getAccounts().then(function (result) {
                    if (result[0] !== accounts[0]) {
                        console.log("******************* reload ************************");
                        window.location.reload();
                    }
                });

            });

            this.setState({
                web3,
                accounts,
                contract: instanceContract
            }, this.runSet);
        } catch (error) {
            _notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        <b><Translate id="dashboard.failed_to_laod_web3"/></b>
                    </div>
                ),
                level: "error",
                position: "tr",
                autoDismiss: 15
            });
            console.log(error);
        }
    };

    runSet = async () => {
        const {web3, accounts, contract} = this.state;

        this.props.setWeb3Instance({
            web3: web3
        });

        this.props.setAddressInstance({
            address: accounts
        });

        this.props.setProofStoreContractInstance({
            proofStoreContractInstance: contract
        });

        if (accounts.length > 0) {
            this.state._notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        <Translate id="dashboard.login_with_address"/> <b>{accounts[0]}</b> <Translate id="dashboard.in_metamask"/>
                    </div>
                ),
                level: "success",
                position: "tr",
                autoDismiss: 15
            });
        } else {
            this.state._notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        <Translate id="dashboard.metamask_error"/>
                    </div>
                ),
                level: "warning",
                position: "tr",
                autoDismiss: 15
            });
        }

    };

    componentDidUpdate(e) {
        if (
            window.innerWidth < 993 &&
            e.history.location.pathname !== e.location.pathname &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {
            document.documentElement.classList.toggle("nav-open");
        }
        if (e.history.action === "PUSH") {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }
    }

    render() {
        return (
            <div className="wrapper">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <Sidebar {...this.props} />
                <div id="main-panel" className="main-panel" ref="mainPanel">
                    <TopInfo msg={<div className="row">
                        <div className="inline col-12 col-sm-12">
                            <a href="https://www.rinkeby.io/#stats" target="new"><img className="logo"
                                                                                      src={EthereumLogo} height="20"
                                                                                      alt="ethereum logo"/>
                                <span style={{color: "black"}}> Rinkeby Testnet</span></a>
                            <span>&emsp;</span>
                            <a href="https://ipfs.io/" target="new"><img className="logo" src={IPSFLogo} height="20"
                                                                         alt="ipfs logo"/></a>
                        </div>
                    </div>}/>
                    <Header {...this.props} />
                    <AnimateCanvas id="simos" />
                    <Switch>
                        {dashboardRoutes.map((prop, key) => {
                            if (prop.name === "Notifications")
                                return (
                                    <Route
                                        path={prop.path}
                                        key={key}
                                        render={routeProps => (
                                            <prop.component
                                                {...routeProps}
                                                handleClick={this.handleNotificationClick}
                                            />
                                        )}
                                    />
                                );
                            if (prop.redirect)
                                return <Redirect from={prop.path} to={prop.to} key={key}/>;
                            return (
                                <Route path={prop.path} component={prop.component} key={key}/>
                            );
                        })}
                    </Switch>
                    <Footer/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setNotificationInstance,
    setProofStoreContractInstance,
    setWeb3Instance,
    setAddressInstance
}, dispatch);

Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default withLocalize(Dashboard);
