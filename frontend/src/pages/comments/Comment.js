// React imports
import React, { useState } from "react";
import { Link } from "react-router-dom";
// Bootstrap import
import { Media } from "react-bootstrap";
// CSS import
import styles from "../../styles/Comment.module.css";
// axios import
import { axiosRes } from "../../api/axiosDefaults";
// Component import
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import CommentEditForm from "./CommentEditForm";
// Notifications
import { NotificationManager } from "react-notifications";

const Comment = (props) => {
  const { 
    profile_id,
    profile_image, 
    owner, 
    updated_at, 
    content,
    id,
    setPost,
    setComments,
 } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
       // Show a success notification
       NotificationManager.info("Comment Deleted!");
      } catch (err) {
        // Show an error notification if there was an issue deleting the comment
        NotificationManager.error(
          "There is an issue with deleting comment",
          "Error"
        );
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
           <CommentEditForm
           id={id}
           profile_id={profile_id}
           content={content}
           profileImage={profile_image}
           setComments={setComments}
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

export default Comment;