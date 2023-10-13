import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import Post from "../Post";
import { act } from 'react-dom/test-utils';

test('Post owner avatar renders', () => {
    render(
        <Router>
            <Post />
        </Router>
    );

    const postOwnerAvatar = screen.getByAltText("avatar");
    expect(postOwnerAvatar).toBeInTheDocument()
});

describe('renders Post component', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Post />
      </Router>,
    );

  test('renders the Post component', async () => {
    renderComponent();
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
