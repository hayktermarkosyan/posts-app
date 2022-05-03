import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Col, Card } from "antd";
import unknownUser from "../images/unknown_user.png";
import { useUserAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState([]);

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
    <Col 
      xs={{span: 20, offset: 4}}
      sm={{offset: 0}}
      span={20}
      >
      <div align="center" style={{marginTop: "50px", fontSize: "22px"}}>
        <p>Welcome to home page!</p>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            userData.profilePhoto !== undefined ? <img alt="user" src={userData.profilePhoto} /> :
                                              <img alt="unknown" src={unknownUser} />
          }
        >
          <Card.Meta 
            title={userData.name !== undefined ? userData.name : "Unknown user"} 
            description={userData.phoneNum !== undefined ? userData.phoneNum : "Unknown user"} />
        </Card>
      </div>
    </Col>
  );
};

export default Home;