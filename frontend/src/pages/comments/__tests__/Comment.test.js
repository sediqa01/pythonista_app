import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import Comment from "../Comment";
import { act } from 'react-dom/test-utils';

test('Event owner avatar renders', () => {
    render(
        <Router>
            <Comment />
        </Router>
    );

    const commentOwnerAvatar = screen.getByAltText("avatar");
    expect(commentOwnerAvatar).toBeInTheDocument()
});

describe('renders Comment component', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Comment />
      </Router>,
    );

  test('renders the Comment component', async () => {
    renderComponent();
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
