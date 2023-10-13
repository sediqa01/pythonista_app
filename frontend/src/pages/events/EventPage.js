import React, {useEffect, useState} from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
// bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import  Container from "react-bootstrap/Container";
// css
import appStyles from "../../App.module.css";
// component import
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import ConversationCreateForm from "../conversations/ConversationCreateForm";
import Event from '../events/Event'
import Conversation from "../conversations/Conversation";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";
import InfiniteScroll from "react-infinite-scroll-component";

function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [conversation, setConversation] = useState({ results: [] });

    useEffect(() => {
        const handleMount = async () => {
          try {
            const [{ data: event }, {data: conversation}] = await Promise.all([
              axiosReq.get(`/events/${id}`),
              axiosReq.get(`/conversations/?event=${id}`)
            ]);
            setEvent({ results: [event] });
            setConversation(conversation)
          } catch (err) {
            // console.log(err);
          }
        };
    
        handleMount();
      }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
      <PopularProfiles mobile />
      <Event {...event.results[0]} setEvents={setEvent} eventPage />
        <Container className={appStyles.Content}>
        {currentUser ? (
            <ConversationCreateForm
            profile_id={currentUser.profile_id}
            profileImage={profile_image}
            event={id}
            setEvent={setEvent}
            setConversation={setConversation}
          />
          ) : conversation.results.length ? (
            "Conversations"
          ) : null}
          {conversation.results.length ? (
            <InfiniteScroll
            children={conversation.results.map((conversation) => (
              <Conversation 
                key={conversation.id}
                {...conversation}
                setEvent={setEvent}
                setConversation={setConversation}
               />
            ))}
                dataLength={conversation.results.length}
                loader={<Asset spinner />}
                hasMore={!!conversation.next}
                next={() => fetchMoreData(conversation, setConversation)}
            />
          ) : currentUser ? (
            <span>No discussion yet, be the first to add!</span>
          ) : (
            <span>No discussion... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
       <PopularProfiles />
      </Col>
    </Row>
  );
}

export default EventPage;