import React, { useState , useEffect} from 'react';
import { Button, Col, Divider, Input, Row } from 'antd';
import { setDoc, doc, serverTimestamp, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import { v4 } from 'uuid';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const Posts = () => {
  const [post, setPost] = useState("");
  const [data, setData] = useState([]);
  const { user } = useUserAuth();

  const createPost = async () => {
    try {
      if(post.length !== 0) {
        await setDoc(doc(db, "posts", v4()), {
          userID: user.uid,
          createdBy: user.email,
          post,
          wasLiked: false,
          isLike: false,
          likesCount: 0,
          time: serverTimestamp()
        });
        setPost("");
      }
    } catch (error) {
      alert(error);
    }
  }

  const likePost = async (post) => {
    if(user === null) {
      alert("You can`t like the post, you aren`t authorized")
      return;
    }
    try {
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        wasLiked: !post.wasLiked,
        likesCount: post.wasLiked === false ? post.likesCount += 1 : post.likesCount -= 1
      });
    } catch (error) {
      alert(error);
    }
  }

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
    <Col 
      span={20} xs={{offset: 4}} sm={{offset: 0}} 
      align="center" style={{fontSize: "40px"}}
    >
          Posts
          <Row 
            style={{marginTop: "25px", fontSize: "16px"}} 
            justify="start"
          >
            {data.map(d => (
              <Col xs={16} sm={10} md={10} lg={5} key={d.id} className="post-place" >
              <div className="post-text">
                {d.post}
              </div>
              <Divider />
              <Button 
                className="post-reaction"
                onClick={() => likePost(d)}
              >
                {user !== null && d.wasLiked ? <HeartFilled style={{fontSize: "larger"}} /> : 
                              <HeartOutlined style={{fontSize: "larger"}} />}
                <>{d.likesCount !== 0 ? d.likesCount : null}</>
              </Button>
              <div className="post-author">
                Created by: {user !== null && d.userID === user.uid ? "You" : d.createdBy}
              </div>
            </Col>  
            ))}
            
          </Row>

          {user && (
            <Row>
              <Col 
                xs={{span: 20, offset: 1}} 
                sm={{span: 21, offset: 2}} 
                md={{span: 22, offset: 1}} lg={22}
              >
                <Input.TextArea 
                  style={{marginTop: "25px", fontSize: "20px"}}
                  rows={3} 
                  placeholder="Write a post" 
                  maxLength={1000} 
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                />

                <Button 
                  type="primary" 
                  size="large"
                  className="page-btn"
                  style={{marginTop: "25px", marginBottom: "25px"}}
                  onClick={createPost}
                >
                  Create post
                </Button>
              </Col>
            </Row>
          )}
    </Col>
  )
}

export default Posts;