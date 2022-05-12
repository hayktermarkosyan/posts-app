import { Button, Col, Input } from 'antd';
import { setDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState, useEffect } from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { v4 } from 'uuid';

const CreateComment = ({post, user}) => {
    const [comment, setComment] = useState();
    const [userData, setUserData] = useState([]);

    const createComment = async (post) => {
        try {
          if(comment.length !== 0) {
            await setDoc(doc(db, "posts", post.id), {
              ...post,
              comments: [...post.comments, {
                  id: v4(),
                  commentedBy: userData.name ? userData.name : "Unknown User",
                  commentText: comment,
                  userImage: userData.profilePhoto ? userData.profilePhoto : ""
              }]
            });
            setComment("");
          }
        } catch (error) {
          alert(error);
        }
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
        <Col xs={12} sm={13} md={16} lg={18}>
            <Input.TextArea 
                style={{fontSize: "small"}}
                rows={1} 
                placeholder="Write a comment" 
                maxLength={1000} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}  
            />
            <Button 
                onClick={() => createComment(post)}
                className="post-comment"
            >
                <CommentOutlined style={{fontSize: "larger"}} />
            </Button>
        </Col>
    )
}

export default CreateComment;