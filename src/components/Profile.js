import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useUserAuth } from '../context/AuthContext';

const Profile = () => {
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [phoneNum, setPhoneNum] = useState();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [perc, setPerc] = useState();
  
  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        phoneNum,
        email: user.email,
        id: user.uid,
        profilePhoto: data.img,
        timeStamp: serverTimestamp()
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


  return (
    <>
      <Input
          type="file" 
          style={{ marginTop: "150px" }}
          disabled={perc !== null && perc < 100}
          onChange={(e) => setImage(e.target.files[0])} 
      />

      <hr />

      <div style={{ marginTop: "25px" }}>
        <Form 
          name="profile" 
          onFinish={handleSubmit} 
          validateMessages={{
            required: true
          }}
        >
          <Form.Item
            name="full-name"
            rules={[
              {
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
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input 
              placeholder="Phone number"
              prefix={<PhoneOutlined />}
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
            >
              Edit Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
    
  )
}

export default Profile;