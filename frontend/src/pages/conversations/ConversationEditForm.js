import React, { useState } from "react";
// bootstrap
import Form from "react-bootstrap/Form";
// axios
import { axiosRes } from "../../api/axiosDefaults";
// style
import styles from "../../styles/Comment.module.css";
// Notifications
import { NotificationManager } from "react-notifications";

function ConversationEditForm(props) {
    const { id, content, setShowEditForm, setConversation } = props;
    const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/conversations/${id}/`, {
        content: formContent.trim(),
      });
      setConversation((prevConversations) => ({
        ...prevConversations,
        results: prevConversations.results.map((conversation) => {
          return conversation.id === id
            ? {
                ...conversation,
                content: formContent.trim(),
                updated_at: "now",
              }
            : conversation;
        }),
      }));
      setShowEditForm(false);
    // Show a success notification
    NotificationManager.info("Comment Edited!");
  } catch (err) {
    // Show an error notification if there was an issue updating the comment
    NotificationManager.error(
      "There was an issue editing your comment",
      "Error"
    );
  }
};


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={styles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default ConversationEditForm;