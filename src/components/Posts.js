import React, { useState , useEffect} from 'react';
import { Col, Divider, Row } from 'antd';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import EditPost from './EditPost';
import LikePost from './LikePost';
import DeletePost from './DeletePost';
import CreatePost from './CreatePost';
import CreateComment from './CreateComment';
import Comments from './Comments';
import SavePost from './SavePost';

const Posts = () => {
  const [postsData, setPostsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "posts"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPostsData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [user])

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

  console.log(userData)
  return (
    <Col 
      span={20} xs={{offset: 4}} sm={{offset: 2}} lg={{offset: 1}}
      align="center" style={{fontSize: "40px"}}
    >
          Posts
          
          <Row 
            style={{marginTop: "25px", fontSize: "16px"}} 
            justify="start"
          >
            {postsData.map(post => (
              <Col xs={22} sm={22} md={22} lg={22} key={post.id} className="post-place">
                <div className="post-text">{post.text}</div>

                {(user !== null && post.userID === user.uid) && <DeletePost post={post} />}

                <Divider />

                {post.comments.length !== 0 && <Comments comments={post.comments} />}

                {user && <CreateComment post={post} />}

                {(user !== null && post.userID === user.uid) && <EditPost post={post} />}
                
                <LikePost post={post} />

                {user && <SavePost post={post} userData={userData} />}
                
                <div className="post-author">
                  Created by: {user !== null && post.userID === user.uid ? "You" : post.createdBy}
                </div>
              </Col>  
              ))
            }
          </Row>
          
          {user && <CreatePost />}
    </Col>
  )
}

export default Posts;