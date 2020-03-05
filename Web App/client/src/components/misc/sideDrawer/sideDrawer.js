import React from 'react'

import './sideDrawer.css'

const sideDrawer = props => {
  // let drawerClasses = ['side-drawer'];
  let drawerClasses = 'side-drawer';
  if(props.show){
    // drawerClasses = ['side-drawer','open'];
    drawerClasses = 'side-drawer open';
  }


  return (
    <nav className={drawerClasses}>
      <ul id="dynamic-list">
        <li>
          <a href="/">Products</a>
        </li>
        <li>
          <a href="/">Users</a>
        </li>
        <li>
          <a href="/login">Login</a>
        </li>
      </ul>
    </nav>
  );
}

export default sideDrawer
