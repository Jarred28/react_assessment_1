import { Component } from "react";

// to get api key: https://openweathermap.org/appid
const API_KEY = "0994aae8ef6904687171e1e7d2a9ec38";

interface CityWeatherProps {
  city: string;
}

interface CityWeatherState {
  weatherResult: any;
}

export class CityWeather extends Component<CityWeatherProps, CityWeatherState> {
  public constructor(props) {
    super(props);
    this.state = {
      weatherResult: null,
    };
  }

  fetchWeatherData = (city: string) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((result) => {
        this.setState({ weatherResult: result });
      })
      .catch((err) => {
        console.log("Something went wrong internally, try it again later");
      });
  };

  public componentDidMount() {
    const { city } = this.props;
    this.fetchWeatherData(city);
  }

  //fix-bug: when user inputs new city name, it should fetch new weather data again.
  public componentDidUpdate(prevProps) {
    if (prevProps.city !== this.props.city) {
      this.fetchWeatherData(this.props.city);
    }
  }

  public render() {
    const { city } = this.props;
    const { weatherResult } = this.state;
    //fix-bug: WeatherResult is null until it fetches result, so it should render nothing until it loads correct data.
    if (!weatherResult) return null;
    return (
      <div>
        {weatherResult.cod === 200 && (
          <>
            <h1>{city}</h1>
            <div>
              Temperature: {KtoF(weatherResult?.main?.temp).toFixed(0)} &#8457;
            </div>
            <div>Descripiton: {weatherResult?.weather[0].description}</div>
          </>
        )}
        {weatherResult.cod === "404" && <span>{weatherResult.message}</span>}
      </div>
    );
  }
}

function KtoF(tempKevlin: number) {
  return ((tempKevlin - 273.15) * 9) / 5 + 32;
}
