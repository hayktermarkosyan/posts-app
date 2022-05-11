import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button, Input, Col } from "antd";
import { useUserAuth } from "../context/AuthContext";
import Loading from "./Loading";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logOut } = useUserAuth();
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      await logOut();
      navigate("/");
    } catch (err) {
      setError(err.message);
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
      
      <div align="center" style={{fontSize: "18px"}}>
        Do you have an account? <Link to="/">Log In</Link>
      </div>
    </Col>
  );
};

export default Signup;