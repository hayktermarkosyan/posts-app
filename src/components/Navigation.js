import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Col, Row, Button } from "antd";
import { setDoc, doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  HomeOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  ProfileOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { useUserAuth } from '../context/AuthContext';

const Navigation = () => {
  const [data, setData] = useState([]);
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/", { replace: true });
      data.map(async (post) => {
        try {
          await setDoc(doc(db, "posts", post.id), {
            ...post,
            waslLiked: false,
          });
        } catch (error) {
          console.log(error.message);
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "posts"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [user])

  return (
    <Row justify="center">
      <Col>
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
                    to="/profile" 
                    title="Profile" 
                    className="icon-btn" 
                    style={{top: 0}} 
                  >
                  <ProfileOutlined className="icon" />
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
