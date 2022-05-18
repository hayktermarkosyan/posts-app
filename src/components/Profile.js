import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Input, Button } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { setDoc, doc, serverTimestamp, collection, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Profile = ({user}) => {
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [phoneNum, setPhoneNum] = useState();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [perc, setPerc] = useState();
  const [userData, setUserData] = useState([]);

  // const validateMessages = {
  //   required: `${label} is required!`,
  //   types: {
  //     email: `${label} is not a valid email!`,
  //     number: `${label} is not a valid number!`,
  //   },
  //   number: {
  //     range: `${label} must be between ${min} and ${max}`,
  //   },
  // };
  
  const handleSubmit = async () => {
    try {
      userData.length !== 0 ? await setDoc(doc(db, "users", user.uid), {
        ...userData,
        name,
        phoneNum,
        profilePhoto: data.img,
      }) : await setDoc(doc(db, "users", user.uid), {
            name,
            phoneNum,
            email: user.email,
            id: user.uid,
            profilePhoto: data.img,
            timeStamp: serverTimestamp(),
            savedPosts: []
          });
      navigate("/home");
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + image.name;

      console.log(name);
      const storageRef = ref(storage, image.name);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    image && uploadFile();
  }, [image]);

  useEffect(() => {
    if(user !== null) {
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
    }
  }, [user])

  return (
    <Col
      xs={{span: 16, offset: 2}} 
      sm={{span: 16, offset: 2}} 
      md={{span: 16, offset: 2}} 
      lg={{span: 6, offset: 0}}
    >
      <p style={{ marginTop: "150px", textAlign: "center", fontSize: "24px" }}>Choose your profile image</p>
      <Input
          type="file" 
          disabled={perc !== null && perc < 100}
          onChange={(e) => setImage(e.target.files[0])} 
      />

      <hr />

      <div style={{ marginTop: "25px" }}>
        <Form 
          name="profile" 
          onFinish={handleSubmit} 
          // validateMessages={validateMessages}
        >
          <Form.Item
            name="full-name"
            rules={[
              {
                type: 'string',
                required: true,
                message: 'Please input your Full Name!'
              },
            ]}
          >
            <Input 
              placeholder="Full Name"
              prefix={<UserOutlined />}
              size="large"
              style={{borderRadius: "10px"}} 
              onChange={(e) => setName(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            name="phone-number"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!'
              },
            ]}
          >
            <Input
              type="text" 
              placeholder="Phone number"
              prefix={<PhoneOutlined />} 
              maxLength={11} 
              pattern="/^\d{11}$/"           
              size="large"
              style={{borderRadius: "10px"}} 
              onChange={(e) => setPhoneNum(e.target.value)} 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              className="page-btn"
              disabled={perc !== null && perc < 100}
            >
              Edit Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Col>
    
  )
}

export default Profile;