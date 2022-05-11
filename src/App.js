import { Layout, Row } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import SavedPosts from "./components/SavedPosts";
import { useUserAuth } from "./context/AuthContext";
import Loading from "./components/Loading";

function App() {
  const { user } = useUserAuth();

  return (
    <Layout hasSider style={{backgroundColor: "white"}}>
      <Layout.Sider 
        theme="light" 
        width="80" 
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: "1px solid #bfc2c6"
        }}>
        <Navigation />
      </Layout.Sider>

      <Layout style={{backgroundColor: "white", marginTop: "20px"}}>
        <Layout.Content>
          <Row justify="center" align="middle">
            
              <Routes>
                <Route exact path="/" element={<ProtectedRoute />}>
                  <Route index element={<Home />} />
                  <Route exact path="/profile" element={<Profile />} />
                  <Route exact path="/saved" element={<SavedPosts />} />
                </Route>

                <Route exact path="/posts" element={<Posts />} />

                <Route exact path="/login" element={<Login />} />

                <Route exact path="/signup" element={<Signup />} />

                <Route exact path="*" element={<Navigate to="/" />} />
            </Routes>
            
            
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;