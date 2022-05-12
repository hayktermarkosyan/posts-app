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
import { UserAuthContext } from "./context/AuthContext";
import Loading from "./components/Loading";

function App() {
  return (
    <UserAuthContext.Consumer>
      {({user, logIn, signUp, logOut, googleSignIn}) => (
        <Layout hasSider style={{backgroundColor: "white"}}>
          <Layout.Sider theme="light" width="80" className="sider">
            <Navigation user={user} logOut={logOut} />
          </Layout.Sider>

          <Layout style={{backgroundColor: "white", marginTop: "20px"}}>
            <Layout.Content>
              <Row justify="center" align="middle">
                {user === null && localStorage.getItem("accessToken") !== null ? 
                  <Loading marginTop="200px" /> : (
                    <Routes>
                      <Route exact path="/" element={<ProtectedRoute user={user} />}>
                        <Route index element={<Home user={user} />} />
                        <Route exact path="/profile" element={<Profile user={user} />} />
                        <Route exact path="/saved" element={<SavedPosts user={user} />} />
                      </Route>
                      <Route exact path="/posts" element={<Posts user={user} />} />
                      <Route 
                        exact 
                        path="/login" 
                        element={
                          user ? <Navigate to="/" /> : <Login logIn={logIn} googleSignIn={googleSignIn} />
                        } 
                      />
                      <Route 
                        exact 
                        path="/signup" 
                        element={
                          user ? <Navigate to="/" /> : <Signup signUp={signUp} logOut={logOut} />
                        } 
                      />
                      <Route exact path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
              </Row>
            </Layout.Content>
          </Layout>
        </Layout>
      )}
    </UserAuthContext.Consumer>
    
  );
}

export default App;