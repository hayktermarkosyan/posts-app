import React from 'react';
import { Col, Row } from 'antd';
import unknownUser from "../images/unknown_user.png";

const Comments = ({comments}) => {
    
    return (
        <Col xs={12} sm={13} md={16} lg={18}>
           {comments.map(com => (
               <Row key={com.id} justify="center">
                   <Col span={2}>
                        {com.userImage !== "" ? 
                            <img alt={com.commentedBy} src={com.userImage} className="comment-image" /> :
                            <img alt={com.commentedBy} src={unknownUser} className="comment-image" />
                        }
                   </Col>
                   <Col span={22} className="comment-place">
                        <div>{com.commentedBy}</div>
                        <div style={{fontWeight: "600"}}>{com.commentText}</div>
                   </Col>
               </Row>
            ))}
        </Col>
    )
}

export default Comments;