import React, { useRef, useState, useEffect, } from "react";
import {  useHistory, useParams} from "react-router-dom";
// Bootstrap imports
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
// css
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
// component
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function  PostEditForm() {
  useRedirect('loggedOut')
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { content, image, is_owner } = data;

        is_owner ? setPostData({  content, image }) : history.push("/");
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [history, id]);


  const [postData, setPostData] = useState({
    content: "",
    image: "",
  });
  const { content, image } = postData;

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("content", content);
    if (imageInput?.current?.files[0]) {
        formData.append("image", imageInput.current.files[0]);
      }
  
      try {
        await axiosReq.put(`/posts/${id}/`, formData);
        history.push(`/posts/${id}`);
      } catch (err) {
        console.log(err);
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
    };

  const textFields = (
    <div className="text-center pt-0 pt-lg-4">
      <Form.Group>
        <Form.Label className={appStyles.headerText}>Post Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          placeholder="Write your post content here ..."
          aria-label="text-area"
          className={appStyles.Input}
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="danger" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-5 mb-0`}
        onClick={() => {
          history.goBack();
        }}
      >
        Cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-5 mb-0`} type="submit"
      >
      Edit
      </Button>
    </div>
  );

  return (
    <Form
     className="mt-2 mt-md-5"
     onSubmit={handleSubmit}
     >
      <Row>
        <Col className="py-2 p-0 p-md-2">
          <Container
            className={`${styles.Container} d-flex flex-column justify-content-center pt-2 pb-3 mt-0`}
          >
            <Form.Group className="text-center">
            <figure>
               <Image className={appStyles.Image} src={image} rounded />
            </figure>
             <div>
            <Form.Label
                className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                htmlFor="image-upload"
                >
                Change the image
            </Form.Label>
            </div>
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="danger" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="mb-6">{textFields}</div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;