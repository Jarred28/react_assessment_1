import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "isomorphic-unfetch";

import App from "./index";

const correctResponse = {
  weather: [
    {
      description: "Overcast clouds",
    },
  ],
  main: {
    // temp in Kelvin
    temp: 295.372,
  },
  cod: 200,
};

const incorrectResponse = {
  message: "city not found.",
  cod: "404",
};

const server = setupServer(
  rest.get("https://api.openweathermap.org/*", (req, res, ctx) => {
    const city = req.url.searchParams.get("q");
    return res(
      ctx.json(city === "New York" ? correctResponse : incorrectResponse)
    );
  })
);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  render(<App />);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("it renders weather search form", async () => {
  expect(screen.getByTestId("city-form")).toBeTruthy();
  expect(screen.getByTestId("weather-input")).toBeTruthy();
  expect(screen.getByTestId("submit-btn")).toBeTruthy();
  expect(screen.queryByTestId("city-wrapper")).toBeNull();
});

const initialSetup = async (cityName: string) => {
  const weatherInput = screen.getByTestId("weather-input");
  const submitBtn = screen.getByTestId("submit-btn");

  fireEvent.change(weatherInput, { target: { value: cityName } });
  submitBtn.click();

  await waitFor(() => screen.getByTestId("city-wrapper"));
};

test("it renders weather result when user inputs city name", async () => {
  await initialSetup("New York");

  expect(screen.getByTestId("city")).toHaveTextContent("NEW YORK");
  expect(screen.getByTestId("temperature")).toHaveTextContent("72 ℉");
  expect(screen.getByTestId("description")).toHaveTextContent(
    "Overcast clouds"
  );
});

test("it renders error message when user inputs wrong city name", async () => {
  await initialSetup("Wrong City");

  expect(screen.queryByTestId("city")).toBeFalsy();
  expect(screen.getByTestId("error-message")).toHaveTextContent(
    "city not found."
  );
});

// todo: add more tests, maybe error handling?
