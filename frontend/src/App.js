import React from "react";
import { Route, Switch } from "react-router-dom";
import styles from './App.module.css';
import NavBar from './components/NavBar';
import { Container } from 'react-bootstrap';
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import EventCreateForm from "./pages/events/EventCreateForm";
import EventPage from "./pages/events/EventPage";
import EventsPage from "./pages/events/EventsPage";
import EventEditForm from './pages/events/EventEditForm';
import NotFound from "./components/NotFound";


function App() {
  return (
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <PostsPage message="Sorry! no results found :(" />
            )}
          />
            <Route exact path="/signin" render={() => <SignInForm />} />
            <Route exact path="/signup" render={() => <SignUpForm />} />
            {/* Post url */}
            <Route exact path="/posts/create" render={() => <PostCreateForm />} />
            <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
            <Route exact path="/posts/:id" render={() => <PostPage />}/>
            {/* profile url */}
            <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
            <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />}/>
            <Route
                  exact
                  path="/profiles/:id/edit/password"
                  render={() => <UserPasswordForm />}
                />
              <Route
                  exact
                  path="/profiles/:id/edit"
                  render={() => <ProfileEditForm />}
                />
                {/* event url */}
                <Route
                  exact
                  path="/events/create"
                  render={() => <EventCreateForm />}
                />
                <Route
                  exact
                  path="/events/:id"
                  render={() => 
                  <EventPage />} />
                <Route
                  exact
                  path="/events"
                  render={() => (
                    <EventsPage message="Sorry! no results found :(" />
                  )}
                  />
                <Route
                  exact
                  path="/events/:id/edit"
                  render={() => <EventEditForm />}
                />
                <Route render={() => <NotFound />} /> 
          </Switch>
        </Container>
      </div>
  );
}

export default App;
