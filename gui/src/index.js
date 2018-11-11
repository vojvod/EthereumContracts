import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import store from './store';
import {HashRouter, Route, Switch} from "react-router-dom";
import {LocalizeProvider} from "react-localize-redux";
import indexRoutes from "./routes/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/light-bootstrap-dashboard.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

ReactDOM.render(
    <Provider store={store}>
        <LocalizeProvider store={store}>
            <HashRouter>
                <Switch>
                    {indexRoutes.map((prop, key) => {
                        return <Route to={prop.path} component={prop.component} key={key}/>;
                    })}
                </Switch>
            </HashRouter>
        </LocalizeProvider>
    </Provider>,
    document.getElementById("root")
);
