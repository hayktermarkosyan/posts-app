import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "antd";
import unknownUser from "../images/unknown_user.png";
import { useUserAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useUserAuth();
  const [data, setData] = useState([]);

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
            setData(item);
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
    <>
      <div align="center" style={{marginTop: "150px", fontSize: "22px"}}>
        <p>Welcome to home page!</p>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            data.profilePhoto !== undefined ? <img alt="user" src={data.profilePhoto} /> :
                                              <img alt="unknown" src={unknownUser} />
          }
        >
          <Card.Meta 
            title={data.name !== undefined ? data.name : "Unknown user"} 
            description={data.phoneNum !== undefined ? data.phoneNum : "Unknown user"} />
        </Card>
      </div>
    </>
  );
};

export default Home;