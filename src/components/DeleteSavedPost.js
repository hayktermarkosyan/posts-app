import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const DeleteSavedPost = ({post, userData}) => {

    const deletePost = async (post) => {
        try {
            await setDoc(doc(db, "users", userData.id), {
              ...userData,
              savedPosts: userData.savedPosts.filter(el => el.id !== post.id)
            });
        } catch (error) {
        alert(error);
        }
    }

    return (
        <Button
            className="post-delete"
            onClick={() => deletePost(post)}
        >
            <CloseCircleOutlined title='Click to unsave post' style={{fontSize: "larger"}} />
        </Button>
    )
}

export default DeleteSavedPost;