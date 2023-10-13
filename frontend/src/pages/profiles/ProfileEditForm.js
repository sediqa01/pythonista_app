import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
// Bootstrap imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
// axios
import { axiosReq } from "../../api/axiosDefaults";
// component
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
// css
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

  
  const ProfileEditForm = () => {
    useRedirect('loggedOut')
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const history = useHistory();
    const imageFile = useRef();
  
    const [profileData, setProfileData] = useState({
      name: "",
      bio: "",
      image: "",
      github: "",
      linkedin: "",
      website: "",
      stack_overflow: "",
     
    });
    const {
      name,
      bio,
      image,
      github,
      linkedin,
      website,
      stack_overflow,
    } = profileData;
  
    const [errors, setErrors] = useState({});
  
    useEffect(() => {
      const handleMount = async () => {
        if (currentUser?.profile_id?.toString() === id) {
          try {
            const { data } = await axiosReq.get(`/profiles/${id}/`);
            const {
                name,
                bio,
                image,
                github,
                linkedin,
                website,
                stack_overflow,
            } = data;
            setProfileData({
                name,
                bio,
                image,
                github,
                linkedin,
                website,
                stack_overflow,
            });
          } catch (err) {
            // console.log(err);
            history.push("/");
          }
        } else {
          history.push("/");
        }
      };
  
      handleMount();
    }, [currentUser, history, id]);
  
    const handleChange = (event) => {
      setProfileData({
        ...profileData,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("github", github);
      formData.append("linkedin", linkedin);
      formData.append("website", website);
      formData.append("stack_overflow", stack_overflow);
      
      if (imageFile?.current?.files[0]) {
        formData.append("image", imageFile?.current?.files[0]);
      }
  
      try {
        const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
        setCurrentUser((currentUser) => ({
          ...currentUser,
          profile_image: data.image,
        }));
        history.goBack();
      } catch (err) {
        // console.log(err);
        setErrors(err.response?.data);
      }
    };
  
    const textFields = (
      <>
        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            value={bio}
            onChange={handleChange}
            name="bio"
            rows={7}
          />
        </Form.Group>
        {errors?.bio?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Form.Group>
          <Form.Label>GitHub Link</Form.Label>
          <Form.Control
            type="url"
            value={github}
            onChange={handleChange}
            name="github"
          />
        </Form.Group>
        {errors?.github?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Form.Group>
          <Form.Label>LinkedIn Link</Form.Label>
          <Form.Control
            type="url"
            value={linkedin}
            onChange={handleChange}
            name="linkedin"
          />
        </Form.Group>
        {errors?.linkedin?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        <Form.Group>
          <Form.Label>Website Link</Form.Label>
          <Form.Control
            type="url"
            value={website}
            onChange={handleChange}
            name="website"
          />
        </Form.Group>
        {errors?.website?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Form.Group> 
          <Form.Label>Stack Overflow Link</Form.Label>
          <Form.Control
            type="url"
            value={stack_overflow}
            onChange={handleChange}
            name="stack_overflow"
          />
        </Form.Group>
        {errors?.stack_overflow?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          onClick={() => history.goBack()}
        >
          cancel
        </Button>
        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
          save
        </Button>
      </>
    );
  
    return (
      <Form
       className="mt-2 mt-md-5"
       onSubmit={handleSubmit}
       >
        <Row className={appStyles.Content}>
          <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
            <Container>
              <Form.Group>
                {image && (
                  <figure>
                    <Image src={image} fluid />
                  </figure>
                )}
                {errors?.image?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
                <div>
                  <Form.Label
                    className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Form.Label>
                </div>
                <Form.File
                  id="image-upload"
                  ref={imageFile}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length) {
                      setProfileData({
                        ...profileData,
                        image: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
              </Form.Group>
              <div className="d-md-none">{textFields}</div>
            </Container>
          </Col>
          <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
            <Container className={appStyles.Content}>{textFields}</Container>
          </Col>
        </Row>
      </Form>
    );
  };
  
  export default ProfileEditForm;