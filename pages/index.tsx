import { useState, useRef } from "react";
import { CityWeather } from "../components/city-weather-refactor";

export default function IndexPage() {
  const [city, setCity] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="py-10 bg-indigo-100 min-h-screen" data-testid="wrapper">
      <form
        data-testid="city-form"
        className="flex items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          const formdata = new FormData(e.currentTarget);
          setCity(formdata.get("city").toString());
        }}
      >
        <span className="text-2xl" onClick={() => inputRef.current?.focus()}>
          Weather Search:
        </span>{" "}
        <input
          data-testid="weather-input"
          className="ml-2 border-gray-200 w-60 bg-white rounded-l-lg h-16 p-4"
          type="text"
          name="city"
          ref={inputRef}
        />
        <button
          data-testid="submit-btn"
          className="text-xl font-bold text-sm text-white f-12 rounded-r-lg p-4 bg-blue-500 h-16"
          type="submit"
        >
          Submit
        </button>
      </form>

      {city && (
        <div className="mt-4">
          <CityWeather city={city} />
        </div>
      )}
    </div>
  );
}
