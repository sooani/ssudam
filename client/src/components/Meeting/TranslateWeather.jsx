const TranslateWeather = ({ weatherType }) => {
  const weatherMap = {
    "moderate rain": "중간 비",
    // ... (나머지 날씨 유형에 대한 매핑 추가)
  };

  return weatherType ? weatherMap[weatherType] : null;
};
export default TranslateWeather;
