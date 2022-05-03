import React from 'react';
import { Button } from 'antd';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/AuthContext';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const LikePost = ({post}) => {
    const { user } = useUserAuth();

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

    return (
        <Button 
            className="post-reaction"
            onClick={() => likePost(post)}
        >
        {user !== null && post.wasLikedBy.includes(user.email) ? 
                        <HeartFilled style={{fontSize: "larger"}} /> : 
                        <HeartOutlined style={{fontSize: "larger"}} />}
        <>{post.wasLikedBy.length !== 0 ? post.wasLikedBy.length : null}</>
        </Button>
    )
}

export default LikePost;