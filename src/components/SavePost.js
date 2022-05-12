import React from 'react';
import { Button } from 'antd';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { SaveFilled, SaveOutlined } from '@ant-design/icons';

const SavePost = ({post, userData}) => {
    
    const savePost = async () => {
        try {
            await setDoc(doc(db, "users", userData.id), {
              ...userData,
              savedPosts: userData.savedPosts.some(el => el.id === post.id) ?
                          userData.savedPosts.filter(el => el.id !== post.id) :
                          [...userData.savedPosts, post]
            });
        } catch (error) {
        alert(error);
        }
    }

    return (
        <Button 
            className="post-saved"
            onClick={savePost}
        >
            {userData.savedPosts.length !== 0 ? (userData.savedPosts.some(el => el.id === post.id) ? 
                <SaveFilled title='Click to unsave post' style={{fontSize: "larger"}} /> : 
                <SaveOutlined title='Click to save post' style={{fontSize: "larger"}} />) 
                : <SaveOutlined title='Click to save post' style={{fontSize: "larger"}} />}
                
            
        </Button>
    )
}

export default SavePost;