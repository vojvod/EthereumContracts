import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import NotificationSystem from "react-notification-system";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";

import {style} from "../../variables/Variables";

import dashboardRoutes from "../../routes/dashboard";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setNotificationInstance} from '../../ducks/dashboard';

import getWeb3 from '../../utils/getWeb3';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleNotificationClick = this.handleNotificationClick.bind(this);
        this.state = {
            _notificationSystem: null
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
        _notificationSystem.addNotification({
            title: <span data-notify="icon" className="pe-7s-gift"/>,
            message: (
                <div>
                    Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
                    every web developer.
                </div>
            ),
            level: level,
            position: "tr",
            autoDismiss: 15
        });

        this.props.setNotificationInstance({
            notification: _notificationSystem
        });

        try {
            // Get network provider and web3 instance.
            const web3 = await
            getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await
            web3.eth.getAccounts();


            // // Get the contract instance.
            // const Contract = truffleContract(SimpleStorageContract);
            // Contract.setProvider(web3.currentProvider);
            // const instance = await
            // Contract.deployed();
            //
            // // Set web3, accounts, and contract to the state, and then proceed with an
            // // example of interacting with the contract's methods.
            this.setState({
                web3,
                accounts,
                // contract: instance
            }, this.runExample);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.log(error);
        }
    }

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
                    <Header {...this.props} />
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
    setNotificationInstance
}, dispatch);

Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard;
