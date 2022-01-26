import { useEffect, useState } from "react";

// to get api key: https://openweathermap.org/appid
const API_KEY = "0994aae8ef6904687171e1e7d2a9ec38";

interface CityWeatherProps {
  city: string;
}
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const CityWeather = (props: CityWeatherProps) => {
  const [weatherResult, setWeatherResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { city } = props;

  const fetchWeatherData = (city: string) => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((result) => {
        setWeatherResult(result);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Something went wrong internally, try it again later");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  if (!weatherResult) return null;
  if (loading) {
    return (
      <div data-testid="city-wrapper">
        <div className="m-auto text-center">loading...</div>
      </div>
    );
  }
  return (
    <div data-testid="city-wrapper">
      {weatherResult.cod === 200 && (
        <div className="rounded-lg bg-white p-10 w-max m-auto text-center mt-10">
          <h1 data-testid="city" className="text-4xl text-gray-600">
            {city.toUpperCase()}
          </h1>

          <div data-testid="description">
            <img
              alt=""
              className="m-auto"
              src={`http://openweathermap.org/img/wn/${weatherResult?.weather[0]?.icon}@2x.png`}
            />
            <span className="text-2xl text-gray-500">
              {capitalize(weatherResult?.weather[0]?.description)}
            </span>
          </div>

          <div data-testid="temperature" className="mt-4">
            <span className="text-2xl text-gray-500">Temperature: </span>
            <span className="text-4xl">
              {KtoF(weatherResult?.main?.temp).toFixed(0)} &#8457;
            </span>
          </div>
        </div>
      )}
      {weatherResult.cod === "404" && (
        <div className="w-max m-auto text-red-600">
          <span data-testid="error-message">{weatherResult.message}</span>
        </div>
      )}
      {error && (
        <div className="w-max m-auto text-red-600">
          <span data-testid="error-message">{error}</span>
        </div>
      )}
    </div>
  );
};

function KtoF(tempKevlin: number) {
  return ((tempKevlin - 273.15) * 9) / 5 + 32;
}

export { CityWeather };
