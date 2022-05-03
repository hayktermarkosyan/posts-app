import React, { useState , useEffect} from 'react';
import { Button, Col, Divider, Input, Row, Modal } from 'antd';
import { deleteDoc, setDoc, doc, serverTimestamp, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import { v4 } from 'uuid';
import { HeartFilled, HeartOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';

const Posts = () => {
  const [post, setPost] = useState("");
  const [data, setData] = useState([]);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [editPostText, setEditPostText] = useState("");
  const { user } = useUserAuth();

  const createPost = async () => {
    try {
      if(post.length !== 0) {
        await setDoc(doc(db, "posts", v4()), {
          userID: user.uid,
          createdBy: user.email,
          post,
          wasLikedBy: [],
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
        wasLikedBy: post.wasLikedBy.includes(user.email) ? post.wasLikedBy.filter(e => e !== user.email) : 
                    [...post.wasLikedBy, user.email]
      });
    } catch (error) {
      alert(error);
    }
  }

  const deletePost = async (post) => {
    try {
      await deleteDoc(doc(db, "posts", post.id));
    } catch (error) {
      console.log(error.message);
    }
  }

  const editPost = async (post) => {
    try {
      console.log(post.id)
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        post: editPostText
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
      span={20} xs={{offset: 4}} sm={{offset: 2}} lg={{offset: 1}}
      align="center" style={{fontSize: "40px"}}
    >
          Posts
          <Row 
            style={{marginTop: "25px", fontSize: "16px"}} 
            justify="start"
          >
            {data.map(d => (
              <Col xs={22} sm={22} md={10} lg={11} key={d.id} className="post-place" >
              <div className="post-text">
                {d.post}
              </div>
              {(user !== null && d.userID === user.uid) && 
                      <Button
                        className="post-delete"
                        onClick={() => deletePost(d)}
                      >
                        <CloseCircleOutlined style={{fontSize: "larger"}} />
                      </Button>
              }

              <Divider />

              {(user !== null && d.userID === user.uid) && 
                      <>
                        <Button
                          className="post-edit"
                          onClick={() => {
                            setVisibleEdit(true);
                            setEditPostText(d.post);
                            console.log(d.id)
                          }}
                        >
                          <EditOutlined style={{fontSize: "larger"}} />
                        </Button>

                        <Modal
                          title="Edit Post"
                          visible={visibleEdit}
                          onOk={() => {
                            debugger
                            setVisibleEdit(false);
                            editPost(d);
                          }}
                          onCancel={() => setVisibleEdit(false)}
                          okText="Edit"
                          width={1000}
                        >
                          <Input.TextArea 
                            style={{fontSize: "20px", width: 1000}}
                            rows={10} 
                            placeholder="Write a post" 
                            maxLength={1000} 
                            value={editPostText}
                            onChange={(e) => setEditPostText(e.target.value)}
                          />
                        </Modal>
                      </>
              }
              
              <Button 
                className="post-reaction"
                onClick={() => likePost(d)}
              >
                {user !== null && d.wasLikedBy.includes(user.email) ? 
                              <HeartFilled style={{fontSize: "larger"}} /> : 
                              <HeartOutlined style={{fontSize: "larger"}} />}
                <>{d.wasLikedBy.length !== 0 ? d.wasLikedBy.length : null}</>
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
                xs={{span: 22, offset: 1}} 
                sm={{span: 22, offset: 1}} 
                md={{span: 21, offset: 1}} 
                lg={{span: 22, offset: 1}}
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