import React from "react";
// bootstrap
import  Container from "react-bootstrap/Container";
// css
import appStyles from "../../App.module.css";
// component
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({mobile}) => {
   const { popularProfiles } = useProfileData();

return (
    <Container
      className={`${appStyles.Content} ${
      mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
        <strong className={appStyles.headerText} >
          <i className="fa-solid fa-users"></i>Discover Profiles
        </strong>
        {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};


export default PopularProfiles