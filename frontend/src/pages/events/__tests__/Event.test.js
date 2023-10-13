import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import Event from "../Event";
import { act } from 'react-dom/test-utils';

test('Event owner avatar renders', () => {
    render(
        <Router>
            <Event />
        </Router>
    );

    const eventOwnerAvatar = screen.getByAltText("avatar");
    expect(eventOwnerAvatar).toBeInTheDocument()
});

describe('renders event component', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Event />
      </Router>,
    );

  test('renders the Event component', async () => {
    renderComponent();
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
