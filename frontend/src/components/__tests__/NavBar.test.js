import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import NavBar from "../NavBar";

test('renders NavBar Home Link', () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );
    // screen.debug();
    const homeLink = screen.getByRole("link", { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
});

test("renders link to the events page for a logged in user", async () => {
    render(
      <Router>
        <CurrentUserProvider>
          <NavBar />
        </CurrentUserProvider>
      </Router>
    );
  
    const events = await screen.findByText('Events');
    expect(events).toBeInTheDocument()
  });
