// React imports
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// CSS import
import styles from "../../styles/Registaration.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
// Axios imports
import axios from "axios";
// Bootstrap imports
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
// Component imports
import { useRedirect } from "../../hooks/useRedirect";

    const SignUpForm = () => {
      useRedirect('loggedIn')
        const [signUpData, setSignUpData] = useState({
          username: "",
          password1: "",
          password2: "",
        });
    const { username, password1, password2 } = signUpData; 
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setSignUpData({
          /* split out earlier signup information so that just the pertinent characteristic is updated */
          ...signUpData,
          /* create key: value pair of name: value */
          [event.target.name]: event.target.value,
        });
      };
    
    const handleSubmit = async (event) => {
    /* prevent the page from refreshing */
    event.preventDefault();
    try {
        /* include the signUpData supplied and reroute to the URL */
        await axios.post("dj-rest-auth/registration/", signUpData);
        history.push("/signin");
    } catch (err) {
        /* optional chaining(?): to check if there is a an error response */
        setErrors(err.response?.data);
    }
    };    

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" lg={6} md={12} xs={12}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>Sign Up</h1>
          <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                />
            </Form.Group>
            {/* display error message if something is wrong with username field */}
            {errors.username?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
            {message}
            </Alert>
            ))}
            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {/* display a message, if there is a password1 error. */}
            {errors.password1?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
            {message}
            </Alert>
            ))}
            <Form.Group controlId="password2">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {/* display an error message if the password2 field contains an error. */}
            {errors.password2?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
            {message}
            </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign Up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
        </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account?  <span> Sign In</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-lg-block p-2 ${styles.SignUpCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={
            "https://res.cloudinary.com/drpij1z8t/image/upload/v1689890890/signup_img_xd388b.png"
          }
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;