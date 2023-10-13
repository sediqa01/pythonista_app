import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import Conversation from "../Conversation";
import { act } from 'react-dom/test-utils';

test('Event owner avatar renders', () => {
    render(
        <Router>
            <Conversation />
        </Router>
    );

    const conversationOwnerAvatar = screen.getByAltText("avatar");
    expect(conversationOwnerAvatar).toBeInTheDocument()
});

describe('renders Conversation component', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Conversation />
      </Router>,
    );

  test('renders the Conversation component', async () => {
    renderComponent();
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
