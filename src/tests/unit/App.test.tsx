import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { store } from "@/store/index";

//black-box test
describe("App", () => {
  it('renders the word "Music App"', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const matches = screen.getAllByText(/Music App/i);
    expect(matches[0]).toBeInTheDocument();
  });
});
