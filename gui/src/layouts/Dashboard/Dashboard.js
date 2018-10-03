import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import NotificationSystem from "react-notification-system";

import TopInfo from "../../components/TopInfo/TopInfo";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import EthereumLogo from "../../assets/img/ethereum.png";
import IPSFLogo from "../../assets/img/ipfs.png"
import AnimateCanvas from  "../../components/AnimateCanvas/AnimateCanvas"

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
                <div>
                    Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
                    every web developer.
                </div>
            ),
            level: level,
            position: position,
            autoDismiss: 15
        });
    }

    componentDidMount= async () => {
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
            const instanceContract = new web3.eth.Contract(ProofContract, '0xddbfa86211e753c0dd22c479b02ca5d620a52352');

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
                        <b>Failed to load web3, accounts, or contract. Check console for details.</b>
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
        const { web3, accounts, contract } = this.state;

        this.props.setWeb3Instance({
            web3: web3
        });

        this.props.setAddressInstance({
            address: accounts
        });

        this.props.setProofStoreContractInstance({
            proofStoreContractInstance: contract
        });

        if(accounts.length > 0){
            this.state._notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        You are login with address: <b>{accounts[0]}</b> in metamask!
                    </div>
                ),
                level: "success",
                position: "tr",
                autoDismiss: 15
            });
        }else {
            this.state._notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift"/>,
                message: (
                    <div>
                        You are not login in metamask!
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
                            <a href="https://www.rinkeby.io/#stats" target="new"><img className="logo" src={EthereumLogo} height="20" alt="ethereum logo"/>
                                <span style={{color: "black"}}> Rinkeby Testnet</span></a>
                            <span>&emsp;</span>
                            <a href="https://ipfs.io/" target="new"><img className="logo" src={IPSFLogo} height="20" alt="ipfs logo"/></a>
                        </div>
                    </div>}/>
                    <Header {...this.props} />
                    <AnimateCanvas id={'canvas-background'}/>
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

export default Dashboard;
