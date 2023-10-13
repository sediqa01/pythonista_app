import React from 'react'
import { Link} from "react-router-dom";
import { useHistory} from "react-router-dom";
// bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// component
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
// css
import appStyles from "../../App.module.css";
import styles from "../../styles/Event.module.css"


const Event = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        conversations_count,
        joins_count,
        join_id,
        image,
        title,
        description,
        updated_at,
        event_date,
        starts_at,
        ends_at,
        location,
        organizer,
        eventPage,
        setEvents,
      } = props;
    
      const currentUser = useCurrentUser();
      const is_owner = currentUser?.username === owner;
      const history = useHistory();

      const handleJoined = async () => {
        try {
          const { data } = await axiosRes.post("/joins/", { event: id });
          setEvents((prevEvents) => ({
            ...prevEvents,
            results: prevEvents.results.map((event) => {
              return event.id === id
                ? {
                    ...event,
                    joins_count: event.joins_count + 1,
                    join_id: data.id,
                  }
                : event;
            }),
          }));
        } catch (err) {
          // console.log(err);
        }
      };
    
      const handleNotJoined = async () => {
        try {
          await axiosRes.delete(`/joins/${join_id}/`);
          setEvents((prevEvents) => ({
            ...prevEvents,
            results: prevEvents.results.map((event) => {
              return event.id === id
                ? {
                    ...event,
                    joins_count: event.joins_count - 1,
                    join_id: null,
                  }
                : event;
            }),
          }));
        } catch (err) {
          // console.log(err);
        }
      };

      

    const handleEdit = () => {
      history.push(`/events/${id}/edit`);
    };
  
    const handleDelete = async () => {
      try {
        await axiosRes.delete(`/events/${id}/`);
        history.goBack();
      } catch (err) {
        // console.log(err);
      }
    };
  return (
    <Card className={styles.Event}>
        <Card.Body>
            <Media className="align-items-center justify-content-between">
            <div>
                <Link to={`/profiles/${profile_id}`}>
                <Avatar src={profile_image} height={55} />
                </Link>
                <span  className={appStyles.Owner}>{owner}</span>
            </div>
            <div className="d-flex align-items-center">
                <small>{updated_at}</small>
                {is_owner && eventPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
            </div>
            </Media>
        </Card.Body>
        <Card.Body>
        
            <Link to={`/events/${id}`}>
                <Card.Img src={image} alt={title} />
            </Link>
            <Link to={`/events/${id}`}>
                <Card.Title className={`text-center ${styles.Title}`}>
                 {title}
                </Card.Title>
            </Link>
            {description && <Card.Text className={styles.EventContent}>{description}</Card.Text>}
            <Row className={`${styles.Row} ${styles.Icon} p-2`}>
              <Col xs={12} md={6}>
                <p>
                  <span className={styles.Icon}><i className="fa-solid fa-calendar-days"></i></span>
                    {event_date}
                </p>
              </Col>
              <Col xs={12} md={6}>
                <p>
                  <span className={styles.Icon}><i className="fa-solid fa-clock"></i></span>
                   {starts_at} - {ends_at}
                </p>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col xs={12} md={6}>
                <p>
                  <span className={styles.Icon}><i className="fa-solid fa-location-dot"></i></span>
                   {location}
                </p>
              </Col>
              <Col xs={12} md={6}>
                <p>
                  <span className={styles.Icon}><i className="fa-solid fa-user-gear"></i></span>
                  {organizer}
                </p>
              </Col>
            </Row>
            <div  className={`${styles.EventBar} text-center text-md-start mt-4 m-3"`}>
            {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't mark Join your own event!</Tooltip>}
            >
              <i
                className={`fa-solid fa-circle-check ${styles.JoinImpossible}`}
              />
            </OverlayTrigger>
          ) : join_id ? (
            <span onClick={handleNotJoined}>
              <i className={`fa-solid fa-circle-check ${styles.Joined}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleJoined}>
              <i className={`fa-solid fa-circle-check ${styles.NotJoined}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to Join events!</Tooltip>}
            >
              <i
                className={`fa-solid fa-circle-check ${styles.JoinImpossible}`}
              />
            </OverlayTrigger>
          )}
          {joins_count}
          <Link to={`/events/${id}`}>
            <i className="fa-solid fa-message" />
          </Link>
          {conversations_count}
           </div>
        </Card.Body>


    </Card>
  )
}

export default Event