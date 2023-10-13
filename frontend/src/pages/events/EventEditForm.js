import React, {  useRef, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
// Bootstrap imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
// css
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
// axios
import { axiosReq } from "../../api/axiosDefaults";
// component
import { useRedirect } from "../../hooks/useRedirect";


function EventEditForm() {
  useRedirect("loggedOut");
  
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    event_date: "",
    starts_at: "",
    ends_at: "",
    location: "",
    organizer: "",
  });
  const {
    title,
    description,
    image,
    event_date,
    starts_at,
    ends_at,
    location,
    organizer,
  } = eventData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        const {
            title,
            description,
            image,
            event_date,
            starts_at,
            ends_at,
            location,
            organizer,
            is_owner,
        } = data;

        is_owner
          ? setEventData({
                title,
                description,
                image,
                event_date,
                starts_at,
                ends_at,
                location,
                organizer,
            })
          : history.push("/");
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setEventData({
        ...eventData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_date", event_date);
    formData.append("starts_at", starts_at);
    formData.append("ends_at", ends_at);
    formData.append("location", location);
    formData.append("organizer", organizer);

    if (imageInput?.current?.files[0]) {
        formData.append("image", imageInput.current.files[0]);
      }
  
      try {
        await axiosReq.put(`/events/${id}/`, formData);
        history.push(`/events/${id}`);
      } catch (err) {
        // console.log(err);
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
    };
  

  const textFields = (
    <div className="text-center pt-0 pt-lg-4 p-2">
        <Form.Group>
            <Form.Label className={appStyles.headerText}>Title</Form.Label>
            <Form.Control
            type="text"
            name="title"
            aria-label="text-box"
            className={appStyles.Input}
            value={title}
            onChange={handleChange}
            />
        </Form.Group>
        {errors?.title?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        <Form.Group>
            <Form.Label className={appStyles.headerText}>Description</Form.Label>
            <Form.Control
            as="textarea"
            rows={6}
            name="description"
            aria-label="text-area"
            className={appStyles.Input}
            value={description}
            onChange={handleChange}
            />
        </Form.Group>
        {errors?.description?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        <Form.Group>
            <Form.Label className={appStyles.headerText}>Event Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="event_date"
              aria-label="date-calender"
              className={appStyles.Input}
              value={event_date}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.event_date?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
          <Form.Group>
            <Form.Label className={appStyles.headerText}>Start Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="starts_at"
              aria-label="time-packer"
              className={appStyles.Input}
              value={starts_at}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.starts_at?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
          <Form.Group>
            <Form.Label className={appStyles.headerText}>End Time</Form.Label>
            <Form.Control
              required
              type="time"
              name="ends_at"
              aria-label="time-packer"
              className={appStyles.Input}
              value={ends_at}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.ends_at?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
          <Form.Group>
            <Form.Label className={appStyles.headerText}>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              aria-label="text-box"
              className={appStyles.Input}
              value={location}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.location?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
          <Form.Group>
            <Form.Label className={appStyles.headerText}>Organizer</Form.Label>
            <Form.Control
              type="text"
              name="organizer"
              aria-label="text-box"
              className={appStyles.Input}
              value={organizer}
              onChange={handleChange}
             
            />
          </Form.Group>
          {errors?.organizer?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-3 mb-0`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-3 mb-0`}
        type="submit"
      >
      Edit
      </Button>
    </div>
  );

  return (
    <Form 
    className="mt-2 mt-md-3"
    onSubmit={handleSubmit}
    >
      <Row>
        <Col className="py-2 p-0 p-md-2">
          <Container
            className={`${styles.Container} d-flex flex-column justify-content-center pb-3 pt-2`}
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
              <Alert variant="warning" key={idx}>
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

export default EventEditForm;