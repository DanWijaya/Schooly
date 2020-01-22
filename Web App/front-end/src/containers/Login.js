import React, { useState } from 'react';
// import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';
import logo from "./images/Schooly_logo.png";
import { RemoveRedEye } from '@material-ui/icons';
import PasswordMask from 'react-password-mask';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordIsMasked, setMasked] = useState(true);

    function validateForm(){
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    // function setMasked(passwordIsMasked) {
    //   useState(!passwordIsMasked);
    // }

    return (
        <div className="Login">
           <img src={logo} alt="logo" className="schooly"/> 
          <Form onSubmit={handleSubmit}>
          
            <Form.Group controlId="user-type" bsSize="large">
                <Form.Label type="user-type" className="login_detail"> Login as </Form.Label>
                <Form.Control as="select">
                    <option>Teacher</option>
                    <option>Student</option>
                    <option>Admin</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="email" bsSize="large">
            <Form.Label type="user-type"> Email </Form.Label>
              <Form.Control
                autoFocus
                type="email"
                value={email}
                placeholder="Enter Email"
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" bsSize="large">
            <Form.Label type="user-type"> Password </Form.Label>
              <Form.Control
              placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password">
                </Form.Control>
            </Form.Group>
            <Button 
            block 
            bsSize="large" 
            disabled={!validateForm()} 
            type="submit">
              Login
            </Button>
          </Form>
        </div>
      )
    }

    export default Login;