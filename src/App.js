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
import Loading from "./components/Loading";

function App({user}) {
  return (
    <Layout hasSider style={{backgroundColor: "white"}}>
      <Layout.Sider theme="light" width="80" className="sider">
        <Navigation user={user} />
      </Layout.Sider>

      <Layout style={{backgroundColor: "white", marginTop: "20px"}}>
        <Layout.Content>
          <Row justify="center" align="middle">
            {user === null && localStorage.getItem("accessToken") !== null ? 
              <Loading marginTop="200px" /> : (
                <Routes>
                  <Route exact path="/" element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                    <Route exact path="/profile" element={<Profile />} />
                    <Route exact path="/saved" element={<SavedPosts />} />
                  </Route>
                  <Route exact path="/posts" element={<Posts user={user} />} />
                  <Route 
                    exact 
                    path="/login" 
                    element={user ? <Navigate to="/" /> : <Login />} 
                  />
                  <Route 
                    exact 
                    path="/signup" 
                    element={user ? <Navigate to="/" /> : <Signup />} 
                  />
                  <Route exact path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;