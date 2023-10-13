import React, { useState } from "react";
import { Link } from "react-router-dom";
// bootstrap
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// css
import styles from "../../styles/Comment.module.css";
import Avatar from "../../components/Avatar";
// axios
import { axiosRes } from "../../api/axiosDefaults";

function ConversationCreateForm(props) {
    const { event, setEvent, setConversation, profileImage, profile_id } = props;
    const [content, setContent] = useState("");
    const handleChange = (event) => {
      setContent(event.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axiosRes.post("/conversations/", {
          content,
          event,
        });
        setConversation((prevConversations) => ({
          ...prevConversations,
          results: [data, ...prevConversations.results],
        }));
        setEvent((prevPost) => ({
            results: [
              {
                ...prevPost.results[0],
              conversations_count: prevPost.results[0].conversations_count + 1,
            },
          ],
        }));
        setContent("");
    } catch (err) {
      //console.log(err);
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
            placeholder="Leave your opinion here .."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} d-block ml-auto m-2`}
        disabled={!content.trim()}
        type="submit"
      >
         submit
      </button>
    </Form>
  );
}

export default ConversationCreateForm;