import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
// bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
// css
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
// component
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import Asset from "../../components/Asset";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} 
from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import Event from "../events/Event"
import { fetchMoreData } from "../../utils/utils";


function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const {setProfileData, handleFollow, handleUnfollow} = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;
  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const [profileEvents, setProfileEvents] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: pageProfile },
          { data: profilePosts },
          { data: profileEvents },
        ] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/posts/?owner__profile=${id}`),
          axiosReq.get(`/events/?owner__profile=${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setProfileEvents(profileEvents);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);


  const mainProfile = (
    <>
    {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
       </Col>
        <Col lg={6}>
           <h2 className={styles.Owner}>{profile?.owner}</h2>
           {profile?.bio && <Col className="p-3">{profile.bio}</Col>}
           <Row className="justify-content-center no-gutters">
            {profile?.github && (
              <a href={profile?.github} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github" aria-hidden="true"></i>
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile?.linkedin} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
              </a>
            )}
            {profile?.website && (
              <a href={profile?.website} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-globe" aria-hidden="true"></i>
              </a>
            )}
            {profile?.stack_overflow && (
              <a href={profile?.stack_overflow} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-stack-overflow" aria-hidden="true"></i>
              </a>
            )}
          </Row>
          <Row className="mt-4 justify-content-space-between">
          <Col className="my-2">
              <div className={styles.Count}>{profile?.posts_count}</div>
              <div>posts</div>
            </Col>
            <Col className="my-2">
              <div className={styles.Count}>{profile?.events_count}</div>
              <div>events</div>
            </Col>
            <Col className="my-2">
              <div className={styles.Count}>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col className="my-2">
              <div className={styles.Count}>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
      </Row>
    </>
  );


  const mainProfilePosts = (
    <>
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
            icon="fa-brands fa-searchengin"
            message={`No result found, ${profile?.owner} hasn't created any posts yet.`} />
      )}
    </>
  );

  const mainProfileEvents = (
    <>
      {profileEvents.results.length ? (
        <InfiniteScroll
          children={profileEvents.results.map((event) => (
            <Event key={event.id} {...event} setEvents={setProfileEvents} />
          ))}
          dataLength={profileEvents.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileEvents.next}
          next={() => fetchMoreData(profileEvents, setProfileEvents)}
        />
      ) : (
        <Asset
            icon="fa-brands fa-searchengin"
            message={`No result found, ${profile?.owner} hasn't created any events yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
    <Col className="py-2 p-0 p-lg-2" lg={12}>
      <Container className={appStyles.Content}>
        {hasLoaded ? (
          <>
            {mainProfile}
            <hr />
            <Row noGutters className="px-3 text-center">
            <Col lg={6} className="p-2">
                <h3 className={styles.Heading}>Posts</h3>
                <div className={styles.postOutline}>
                {mainProfilePosts}
                </div>
              </Col>
              <Col lg={6} className="p-2">
                <h3 className={styles.Heading}>Events</h3>
                {mainProfileEvents}
              </Col>
            </Row>
          </>
        ) : (
          <Asset spinner />
        )}
      </Container>
    </Col>
  </Row>
  );
}

export default ProfilePage;