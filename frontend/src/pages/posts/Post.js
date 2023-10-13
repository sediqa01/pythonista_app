import React from 'react'
import { Link, useHistory  } from "react-router-dom";
// css
import styles from "../../styles/Post.module.css";
import appStyles from "../../App.module.css"

// bootstrap
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// component
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from '../../components/MoreDropdown';

const Post = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        image,
        content,
        updated_at,
        postPage,
        setPosts,
      } = props;
    
      const currentUser = useCurrentUser();
      const is_owner = currentUser?.username === owner;
      const history = useHistory();

      const handleEdit = () => {
        history.push(`/posts/${id}/edit`);
      };

      const handleDelete = async () => {
        try {
          await axiosRes.delete(`/posts/${id}/`);
          history.goBack();
        } catch (err) {
          // console.log(err);
        }
      };

      const handleLike = async () => {
        try {
          const { data } = await axiosRes.post("/likes/", { post: id });
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                return post.id === id
                    ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
                    : post;
                }),
            }));
            } catch (err) {
           // console.log(err);
        }
      };
    
      const handleUnlike = async () => {
        try {
          await axiosRes.delete(`/likes/${like_id}/`);
          setPosts((prevPosts) => ({
            ...prevPosts,
            results: prevPosts.results.map((post) => {
              return post.id === id
                ? { ...post, likes_count: post.likes_count - 1, like_id: null }
                : post;
            }),
          }));
        } catch (err) {
         // console.log(err);

        }
      };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <div>
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={55} />
            </Link>
            <span className={appStyles.Owner}>{owner}</span>
          </div>
          <div className="d-flex align-items-center">
            <small>{updated_at}</small>
              {is_owner && postPage && 
              (
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              )}
            </div>
          </Media>
            {content && <Card.Text className={styles.PostContent}>{content}</Card.Text>}
        <Link to={`/posts/${id}`}>
            <Card.Img src={image} alt={content} />
        </Link>
        <div  className={"text-align-left text-md-start mt-4 m-3"}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className={`fa-solid fa-thumbs-up ${styles.LikeImpossible}`} />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fa-solid fa-thumbs-up ${styles.Liked}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className="fa-solid fa-thumbs-up" />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className={`fa-solid fa-thumbs-up ${styles.LikeImpossible}`} />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
          <i className="fa-solid fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
    
  )
}

export default Post