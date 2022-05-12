import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { EditOutlined } from '@ant-design/icons';

const EditPost = ({post}) => {
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [editPostText, setEditPostText] = useState("");

    const editPost = async (post) => {
        try {
          await setDoc(doc(db, "posts", post.id), {
            ...post,
            text: editPostText
          });
        } catch (error) {
          alert(error);
        }
    }

    const onEditBtnClick = (text) => {
        setVisibleEdit(true);
        setEditPostText(text)
    }

    const onOkBtnClick = (post) => {
        setVisibleEdit(false);
        editPost(post);
    }

    return (
        <>
            <Button
                className="post-edit"
                onClick={() => onEditBtnClick(post.text)}
            >
                <EditOutlined title='Click to edit post' style={{fontSize: "larger"}} />
            </Button>

            <Modal
                title="Edit Post"
                visible={visibleEdit}
                onOk={() => onOkBtnClick(post)}
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
    )
}

export default EditPost;