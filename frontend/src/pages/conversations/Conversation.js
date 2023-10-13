import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
// axios import
import { axiosRes } from "../../api/axiosDefaults";
// Component import
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import ConversationEditForm from "./ConversationEditForm";
// CSS import
import styles from "../../styles/Comment.module.css";

const Conversation = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setEvent,
    setConversation,
} = props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = async () => {
    try {
        await axiosRes.delete(`/conversations/${id}/`)
        setEvent(prevEvent => ({
            results: [
                {
                ...prevEvent.results[0],
                conversations_count: prevEvent.results[0].conversations_count - 1
                },
            ],
        }));

        setConversation((prevConversations) => ({
            ...prevConversations,
            results: prevConversations.results.filter((conversation) => conversation.id !== id),
        }));
    } catch (err) {
        // console.log(err)
    }
};

return (
    <div className="mt-3">
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <ConversationEditForm 
            id={id}
            profile_id={profile_id}
            content={content}
            profileImage={profile_image}
            setConversation={setConversation}
            setShowEditForm={setShowEditForm}
            />
            
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
 </div>
  );
};

export default Conversation;