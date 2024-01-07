import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/Map.module.css";
const MakeMap = (props) => {
  const { kakao } = window;
  // const lat = props.lat;
  // const lng = props.lng;
  // console.log(lat, lng);
  // position은 위도 경도
  const [position, setPosition] = useState({ lat: props.lat, lng: props.lng });
  // address는 주소 > 지금은 props로 받음!
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
    // 마우스 이벤트로 얻은 lat과 lng으로 position 설정하고 도로명 주소를 얻는 getAddress 호출
    setPosition(lat, lng);
    getAddress(position.lat, position.lng);
  };

  // position이 바뀌면 getAddress 다시 호출
  // useEffect(() => {
  //   getAddress(position.lat, position.lng);
  // }, [position]);
  return (
    <div className={classes.container}>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: position.lat,
          lng: position.lng,
          // lat: lat,
          // lng: lng,
        }}
        style={{ width: "90%", height: "34vh" }}
        level={3} // 지도의 확대 레벨
        onClick={(_t, mouseEvent) =>
          setFullAddress({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          })
        }
      >
        {/* 마커 */}
        {position && <MapMarker position={position} />}
      </Map>
    </div>
  );
};

export default MakeMap;
