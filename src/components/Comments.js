import React, { useState } from 'react';
import { Button, Col, Row } from 'antd';
import unknownUser from "../images/unknown_user.png";

const Comments = ({comments}) => {
    const [visible, setVisible] = useState(false);
    
    return (
        <Col xs={12} sm={13} md={16} lg={18}>
           {!visible && (
                            <Row justify="center">
                                <Col span={2}>
                                    {comments[0].userImage !== "" ? 
                                        <img 
                                            alt={comments[0].commentedBy} 
                                            src={comments[0].userImage} 
                                            className="comment-image" 
                                        /> :
                                        <img 
                                            alt={comments[0].commentedBy} 
                                            src={unknownUser} 
                                            className="comment-image" 
                                        />
                                    }
                                </Col>
                                <Col span={22} className="comment-place">
                                    <div>{comments[0].commentedBy}</div>
                                    <div style={{fontWeight: "600"}}>{comments[0].commentText}</div>
                                </Col>
                            </Row>
                        )
            }

           {comments.length > 1 && 
                (!visible ? 
                            <Button 
                                onClick={() => setVisible(true)} 
                                className="all-comments"
                            >
                                View all
                            </Button> : 
                            <>
                                {comments.map(com => (
                                    <Row key={com.id} justify="center">
                                        <Col span={2}>
                                            {com.userImage !== "" ? 
                                                <img 
                                                    alt={com.commentedBy} 
                                                    src={com.userImage} 
                                                    className="comment-image" 
                                                /> :
                                                <img 
                                                    alt={com.commentedBy} 
                                                    src={unknownUser} 
                                                    className="comment-image"
                                                />
                                            }
                                        </Col>
                                        <Col span={22} className="comment-place">
                                            <div>{com.commentedBy}</div>
                                            <div style={{fontWeight: "600"}}>{com.commentText}</div>
                                        </Col>
                                    </Row>
                                ))}
                                <Button 
                                    onClick={() => setVisible(false)} 
                                    className="all-comments"
                                >
                                    Hide
                                </Button>
                            </>
                )
            }
        </Col>
    )
}

export default Comments;