import React, { useState} from 'react';
import { Button, Col, Input, Row } from 'antd';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 } from 'uuid';
import { useUserAuth } from '../context/AuthContext';

const CreatePost = () => {
    const [post, setPost] = useState("");
    const { user } = useUserAuth();

    const createPost = async () => {
        try {
          if(post.length !== 0) {
            await setDoc(doc(db, "posts", v4()), {
              userID: user.uid,
              createdBy: user.email,
              text: post,
              wasLikedBy: [],
              time: serverTimestamp()
            });
            setPost("");
          }
        } catch (error) {
          alert(error);
        }
    }

    return (
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
    )
}

export default CreatePost;