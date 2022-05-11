import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Col, Row, Button } from "antd";
import { 
  HomeOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  ProfileOutlined,
  UnorderedListOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { useUserAuth } from '../context/AuthContext';

const Navigation = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Row justify="center">
      <Col>
        {user && <Link 
                    to="/profile" 
                    title="Profile" 
                    className="icon-btn" 
                    style={{top: 0}} 
                  >
                  <ProfileOutlined className="icon" />
                </Link>
        }
        {user && <Link to="/home" 
                    title="Home" 
                    className="icon-btn" 
                    style={{top:150}}>
                  <HomeOutlined className="icon" />
                </Link>
        }
        <Link 
          to="/posts" 
          title="Posts" 
          className="icon-btn" 
          style={{top:300}}
        >
          <UnorderedListOutlined className="icon" />
        </Link>
        {user && <Link 
                    to="/saved" 
                    title="Saved Posts" 
                    className="icon-btn" 
                    style={{top: 480}} 
                  >
                  <SaveOutlined className="icon" />
                </Link>
        }
        {user && <Button 
                    title="Log Out" 
                    className="icon-btn" 
                  >
                  <LogoutOutlined 
                    className="icon"
                    onClick={handleLogout}
                  />
                </Button>}
        {!user && <Link 
                    to="/login" 
                    title="Log In" 
                    className="icon-btn" 
                  >
                    <LoginOutlined className="icon" />
                  </Link>}
      </Col>
    </Row>
  )
}

export default Navigation;
