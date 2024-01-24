import {
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
} from "weather-icons-react";
const WeatherIcon = ({ weatherType }) => {
  switch (weatherType) {
    case "clear sky":
      return <WiDaySunny size={50} color="skyblue" />;
    case "few clouds":
      return <WiDayCloudy size={50} color="skyblue" />;
    case "scattered clouds":
      return <WiCloud size={50} color="skyblue" />;
    case "broken clouds":
      return <WiCloudy size={50} color="skyblue" />;
    case "shower rain":
      return <WiShowers size={50} color="skyblue" />;
    case "rain":
      return <WiRain size={50} color="skyblue" />;
    case "thunderstorm":
      return <WiThunderstorm size={50} color="skyblue" />;
    case "snow":
      return <WiSnow size={50} color="skyblue" />;
    case "mist":
      return <WiFog size={50} color="skyblue" />;
    default:
      return null; // 다른 날씨 유형에 대한 아이콘이 없는 경우
  }
};
export default WeatherIcon;
