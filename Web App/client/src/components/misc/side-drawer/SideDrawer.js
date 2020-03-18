import React from 'react'

import './SideDrawer.css'
import { Link } from '@material-ui/core';

const sideDrawer = props => {
  // let drawerClasses = ['side-drawer'];
  let drawerClasses = "w3-sidebar w3-light-grey w3-bar-block side-drawer";
  if(props.show){
    // drawerClasses = ['side-drawer','open'];
    drawerClasses = "w3-sidebar w3-light-grey w3-bar-block side-drawer open";
  }

  function actionDropdowns(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
      // x.previousElementSibling.className += " w3-blue";
    } else { 
      x.className = x.className.replace(" w3-show", "");
      x.previousElementSibling.className = x.previousElementSibling.className.replace(" w3-blue", "");
    }
  }

  // function addEntry(id) {
  //   var ul = document.getElementById(id)
  //   var newLink = document.createElement('a')
  //   newLink.setAttribute('class', "w3-bar-item w3-button");
  //   newLink.appendChild(document.createTextNode("Class 3"));
  //   ul.appendChild(newLink);
  // }
  
  
  return (
    <div>
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>

        {/* Sidebar */}
        <div className={drawerClasses} style={{marginTop:"60px", width:"25%", color: "black"}}>
          <h3 class="w3-bar-item">Menu</h3>

          <button class="w3-button w3-block w3-left-align">About</button>
          <button class="w3-button w3-block w3-left-align">Account</button>

            <button class="w3-button w3-block w3-left-align" onClick={() => actionDropdowns("task")}>Tasks <i class="fa fa-caret-down"></i></button>
              <div name="dropdowns" id="task" class="w3-container w3-hide">
                <a class="w3-bar-item w3-button">Task 1</a>
                <a class="w3-bar-item w3-button">Task 2</a>
              </div>

            <button class="w3-button w3-block w3-left-align" onClick={() => actionDropdowns("classes")}>Classes <i class="fa fa-caret-down"></i></button>
              <div name="dropdowns" id="classes" class="w3-container w3-hide">
                <a class="w3-bar-item w3-button">Class 1</a>
                <a class="w3-bar-item w3-button">Class 2</a>
              </div>
{/* 
              <button class="add" onClick={() => addEntry("classes")} > Add classes</button>
              <button class="add" onClick={() => addEntry("task")} > Add Tasks</button> */}
        </div>

          
      </div>
  );
}

export default sideDrawer
