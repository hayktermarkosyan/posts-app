import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Modal } from 'antd';
import Loading from './Loading';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import DeleteSavedPost from './DeleteSavedPost';

const SavedPosts = () => {
    const { user } = useUserAuth();
    const [userData, setUserData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [postText, setPostText] = useState();

    const onPostClick = (text) => {
        setVisible(true);
        setPostText(text);
    }

    useEffect(() => {
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
      }, [user])

    return (
        <>
            <Col 
                span={20} xs={{offset: 4}} sm={{offset: 2}} lg={{offset: 1}}
                align="center" style={{fontSize: "40px"}}
            >
                Saved Posts
                {userData.length !== 0 ? (
                <Row 
                    style={{marginTop: "25px", fontSize: "16px"}} 
                    justify="start"
                >
                    {userData.savedPosts.map(post => (
                    <Col 
                        xs={22} sm={22} md={22} lg={22} 
                        key={post.id} 
                        className="post-place"
                    >
                        <div 
                            className="post-text"
                            onClick={() => onPostClick(post.text)}
                        >
                            {post.text}
                        </div>

                        <Divider />     

                        <DeleteSavedPost post={post} userData={userData} />             
                        
                        <div className="post-author">
                            Created by: {user !== null && post.userID === user.uid ? "You" : post.createdBy}
                        </div>
                    </Col>  
                    ))
                }
                </Row>
            ) : (
                <Row
                    style={{marginTop: "25px", fontSize: "16px"}} 
                    justify="center"
                >
                    <Loading marginTop="0px" />
                </Row>
            )
            }
            {(userData.length !== 0 && userData.savedPosts.length === 0) && 
                <p 
                    style={{marginTop: "50px", fontSize: "medium"}}
                >
                    You don't have any saved posts
                </p>
            }
            </Col>
            <Modal
                title="Read Post"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                okText="Close"
                width={500}
            >
                {postText}
            </Modal>
        </>
    )
}

export default SavedPosts;