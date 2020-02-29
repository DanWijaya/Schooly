import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../SideDrawer/DrawerToggleButton';
import './NavBar.css'
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton.js';
import logo from '../layout/S_logo.png';

class NavBar extends Component {
  render() {
    return (
    <header className="NavBar__a">
    <nav className="navbar-light bg-transparent NavBar__navigation">
      <div className="NavBar__toggle-button">
          <DrawerToggleButton click={this.props.drawerClickHandler} />
      </div>
      <div className="NavBar__logo">
        <a href="/"><img src={logo} className="logo"/></a>
      </div>
      <div className="spacer" />
      <div className="NavBar_navigation-items">
           <ul>
            <li>
              <a href="/login"> Login </a>
             </li>
            <li>
            <a href="/register">Register </a>
            </li>
          </ul>
        
        
      </div>
    </nav>
    </header>
    )
  }
}
// const NavBar = props => (
//   <header className="toolbar__a">
//     <nav className="navbar-light bg-transparent toolbar__navigation">
//       <div className="toolbar__toggle-button">
//           <DrawerToggleButton click={props.drawerClickHandler}/>
//       </div>
//       <div className="toolbar__logo">
//         <a href="/"><img src={logo} className="logo"/></a>
//       </div>
//       <div className="spacer" />
//       <div className="NavBar_navigation-items">
//         <ul>
//           <li>
//             <a href="/">Products</a>
//           </li>
//           <li>
//             <a href="/register">Register</a>
//           </li>
//           <li>
//             <a href="/login">Login</a>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   </header>
// )

export default NavBar;