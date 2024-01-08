import React, { useState, useEffect } from "react";
import axios from "axios";

const KakaoMap = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Kakao Local API 호출
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          "https://dapi.kakao.com/v2/local/search/keyword.json",
          {
            params: {
              query: "수성못", // 여기에 검색하려는 장소 이름을 넣으세요
            },
            headers: {
              Authorization: "KakaoAK e0be5ca61d21f695d1325f7dfee0a866", // 여기에 본인의 Kakao REST API 키를 넣으세요
            },
          }
        );

        setPlaces(response.data.documents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div>
      <h1>Kakao Maps Places</h1>
      <ul>
        {places.map((place, index) => (
          <li key={index}>{place.place_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default KakaoMap;
