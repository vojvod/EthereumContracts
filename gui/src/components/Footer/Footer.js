import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer" style={{margin: 0, padding: 0}}>
        <Grid fluid>
          {/*<nav className="pull-left">*/}
            {/*<ul>*/}
              {/*<li>*/}
                {/*<a href="#pablo">Home</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="#pablo">Company</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="#pablo">Portfolio</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="#pablo">Blog</a>*/}
              {/*</li>*/}
            {/*</ul>*/}
          {/*</nav>*/}
          <p className="copyright pull-left">
            * You must install
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer"> MetaMask </a>
            and login in at Rinkeby Test Network first!
          </p>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://develodio.com" target="_blank" rel="noopener noreferrer">develodio</a>
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
