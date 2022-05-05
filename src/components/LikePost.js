import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Space, Row, Col } from 'antd';
import { setDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import unknownUser from "../images/unknown_user.png"

const LikePost = ({post}) => {
    const { user } = useUserAuth();
    const [userData, setUserData] = useState([]);

    const wasLikedByUsersList = (
      <ul className="reaction-dropdown">
          {post.wasLikedBy.map(u => (
            <li key={u.email} style={{margin: "2px", padding: 0}}>
              <Row justify="center">
                <Col span={4}>
                  {u.photo !== "" ? 
                    <img 
                        alt={u.name} 
                        src={u.photo} 
                        className="reaction-image" 
                    /> :
                    <img 
                        alt={userData.name} 
                        src={unknownUser} 
                        className="reaction-image"
                    />
                  }
                </Col>
                <Col span={20} className="reaction-user-name">
                  <div>{u.name}</div>
                </Col>
              </Row>
            </li>
          ))}
      </ul>
    )

    const likePost = async (post) => {
      if(user === null) {
        return;
      }
      try {
        await setDoc(doc(db, "posts", post.id), {
          ...post,
          wasLikedBy: post.wasLikedBy.some(({email}) => email === user.email) ? 
                      post.wasLikedBy.filter(el => el.email !== user.email) : 
                      [...post.wasLikedBy, {
                                              email: user.email, 
                                              photo: userData.profilePhoto ? userData.profilePhoto : "", 
                                              name: userData.name ? userData.name : "Unknown User"
                      }]
        });
      } catch (error) {
        alert(error);
      }
    }

    useEffect(() => {
      if(user !== null) {
        const unsub = onSnapshot(
          collection(db, "users"),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            list.forEach(item => {
              if(item.id === user.uid) {
                setUserData(item);
              }
            });
          },
          (error) => {
            console.log(error);
          }
        );

        return () => {
          unsub();
        };
      }
    }, [user])

    return (
        <>
          <Button 
            className="post-reaction"
            onClick={() => likePost(post)}
          >
            {user !== null && post.wasLikedBy.some(({email}) => email === user.email) ? 
                            <HeartFilled style={{fontSize: "larger"}} /> : 
                            <HeartOutlined style={{fontSize: "larger"}} />}
          
          </Button>
          <Dropdown
            overlay={wasLikedByUsersList}
            className="post-reaction-users-number"
          >
            <a href='.' onClick={e => e.preventDefault()}>
              <Space>
                {post.wasLikedBy.length !== 0 ? post.wasLikedBy.length : null}
              </Space>
            </a>
          </Dropdown>
        </>
    )
}

export default LikePost;