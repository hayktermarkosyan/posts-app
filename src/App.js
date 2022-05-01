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
import { useUserAuth } from "./context/AuthContext";

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
                <Route
                  exact
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/posts"
                  element={<Posts />}
                />
                <Route 
                  exact 
                  path="/" 
                  element={user ? <Navigate to="/home" /> : <Login />}
                />
                <Route 
                  exact
                  path="/signup" 
                  element={user ? <Navigate to="/home" /> : <Signup />} 
                />
                <Route 
                exact
                path="*" 
                element={<Navigate to="/home" />} 
                />
              </Routes>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;