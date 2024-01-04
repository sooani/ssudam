import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "./MakeMap.module.css";
const MakeMap = (props) => {
  const { kakao } = window;
  //position은 위도 경도
  const [position, setPosition] = useState({ lat: 33.450701, lng: 126.570667 });
  //address는 주소
  // const [address, setAddress] = useState({});

  const getAddress = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(lat, lng); // 주소로 변환할 좌표 입력
    const callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        props.setAddress(result[0].address);
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    // console.log(address);
  };

  const setFullAddress = (lat, lng) => {
    setPosition(lat, lng);
    getAddress(position.lat, position.lng);
  };

  useEffect(() => {}, []);
  useEffect(() => {
    getAddress(position.lat, position.lng);
  }, [position]);
  return (
    <div className={classes.container}>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: position.lat,
          lng: position.lng,
        }}
        style={{ width: "90%", height: "50vh" }}
        level={3} // 지도의 확대 레벨
        onClick={(_t, mouseEvent) =>
          setFullAddress({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          })
        }
      >
        {position && <MapMarker position={position} />}
      </Map>
      {/* <button>선택</button> */}
    </div>
  );
};

export default MakeMap;
