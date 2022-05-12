import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const DeletePost = ({post}) => {

    const deletePost = async (post) => {
        try {
          await deleteDoc(doc(db, "posts", post.id));
        } catch (error) {
          console.log(error.message);
        }
    }

    return (
        <Button
            className="post-delete"
            onClick={() => deletePost(post)}
        >
            <CloseCircleOutlined title='Click to delete post' style={{fontSize: "larger"}} />
        </Button>
    )
}

export default DeletePost;