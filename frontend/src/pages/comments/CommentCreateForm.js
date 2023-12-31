import React, { useState } from "react";
import { Link } from "react-router-dom";
// Bootstrap import
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// CSS import
import styles from "../../styles/Comment.module.css";
import Avatar from "../../components/Avatar";
// Axios import
import { axiosRes } from "../../api/axiosDefaults";
// Notifications
import { NotificationManager } from "react-notifications";


function CommentCreateForm(props) {
  const { post, setPost, setComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        content,
        post,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
     // Show a success notification
     NotificationManager.success("Comment added successfully", "Success!");
    } catch (err) {
      // Show an error notification if there was an issue creating the comment
      NotificationManager.error(
        "There was an issue adding your comment",
        "Error"
      );
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="Type your comment here..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ml-auto m-2`}
        disabled={!content.trim()}
        type="submit"
      >
         Comment
      </button>
    </Form>
  );
}

export default CommentCreateForm;