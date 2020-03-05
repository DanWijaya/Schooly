import React from 'react';

const SideBar = props => {
    return (
        <nav className="SideBar">
          <ul id="dynamic-list">
            <li>
              <a href="/"></a>
            </li>
            <li>
              <a href="/">Classes</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </nav>
      );
}

export default SideBar;
