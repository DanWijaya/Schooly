import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Navbar from './Navbar';

//import pictures
import Avatar from './WEW.jpg';
import './HomeTest.css';

class HomeTest extends Component {
  render() {
    return(
      <div style={{width: "100%", margin: "auto"}}>
        <Navbar />
        <Grid className="hometest-grid">
          <Cell col={6}>
            <img
              src={Avatar}
              alt="avatar"
              className="avatar-img"
            />

            <div className="banner-text">
              <h1>Imma gonna test with this shit bro!</h1>

              <hr/>

              <p>BIO AND BEARDS MODAFUCKA</p>

            <div className="social-links">

              {/* LinkedIn */}
              <a href="http://google.com" rel="noopener noreferrer" target="_blank">
                <i className="fa fa-linkedin-square" aria-hidden="true" />
              </a>

              {/* GitHub */}
              <a href="http://github.com" rel="noopener noreferrer" target="_blank">
                <i className="fa fa-github-square" aria-hidden="true" />
              </a>

              {/* Freecodecamp */}
              <a href="http://facebook.com" rel="noopener noreferrer" target="_blank">
                <i className="fa fa-facebook" aria-hidden="true" />
              </a>

              {/* Youtube */}
              <a href="http://youtube.com" rel="noopener noreferrer" target="_blank">
                <i className="fa fa-youtube" aria-hidden="true" />
              </a>

            </div>

            </div>

          </Cell>
        </Grid>
      </div>

    )
  }
}

export default HomeTest;
