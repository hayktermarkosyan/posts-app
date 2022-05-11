import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Alert, Button, Input } from "antd";
import { useUserAuth } from "../context/AuthContext";
import GoogleButton from "react-google-button";
import Loading from "./Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
    } catch (err) {
      console.log(err.message);
    }
  };


  return localStorage.getItem("accessToken") !== null ? <Loading marginTop="100px" /> : (
    <Col 
      xs={{span: 14, offset: 2}} 
      sm={{span: 16, offset: 2}} 
      md={{span: 16, offset: 2}} 
      lg={{span: 6, offset: 0}} 
      style={{ marginTop: "200px" }}
    >
      <div align="center">
        {error && <Alert 
                    style={{marginBottom: "20px", borderRadius: "10px"}}  
                    type="error" 
                    message={error} 
                  />
        }
        <Form 
          name="login" 
          onSubmitCapture={handleSubmit} 
          validateMessages={{
            required: true,
            types: {
              email: "Email is not a valid"
            }
          }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input 
              placeholder="Email"
              size="large"
              style={{borderRadius: "10px"}} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password 
              placeholder="Password"
              size="large"
              style={{borderRadius: "10px"}}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              className="page-btn"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <GoogleButton
          className="g-btn"
          type="light"
          style={{borderRadius: "5px"}}
          onClick={handleGoogleSignIn}
        />
      </div>
      
      <div align="center" style={{fontSize: "18px"}}>
        Do you want to create an account? <Link to="/signup">Sign up</Link>
      </div>
    </Col>
  );
};

export default Login;