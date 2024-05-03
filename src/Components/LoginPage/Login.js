import React, { useState } from "react";
import "./Login.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      console.log("userData", userData);

      if (!Array.isArray(userData) || userData.length === 0) {
        throw new Error("User data format is incorrect or empty");
      }

      console.log("email:", email);
      console.log("password:", password);

      let user = null;

      for (let i = 0; i < userData.length; i++) {
        if (userData[i].email === email && userData[i].password === password) {
          user = userData[i];
          break;
        }
      }

      console.log("user", user);

      if (user) {
          props.onLogin();
          localStorage.setItem("userData", JSON.stringify(user));
           navigate(`/tasklist?id=${user.id}`);
      } else {
        setError("Invalid User email or password. Please Register The User");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setError("Error fetching user data. Please try again later.");
    }
  };

  const handleRegisterMove = () =>{
    navigate("/register")
  }

  return (
    <div
      style={{
        backgroundColor: "#41e0fd",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container>
        <Row className="justify-content-md-center">
          <Col md="4">
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h2 className="text-center  changeText">
                SIGN IN <hr />
              </h2>
              {error && <div className="text-danger mb-3">{error}</div>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail" className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  block
                  className="changeButton"
                >
                  Login
                </Button>
              </Form>
              <div><h6 className="text-center changeText1 border mt-5 p-2">If you are not Registered User ? <span className="border changeButton color p-1 cursor-pointer" onClick={handleRegisterMove}>Register</span></h6></div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
