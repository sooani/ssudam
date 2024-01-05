import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/MakeMap.module.css";
const MakeMap = (props) => {
  const { kakao } = window;
  const keyword = props.searchkeyword;

  // useEffect(() => {
  //   console.log(keyword);
  // }, [keyword]);
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  // const [map, setMap] = useState();

  // useEffect(() => {
  //   if (!map) return;
  //   const ps = new kakao.maps.services.Places();

  //   ps.keywordSearch(keyword, (data, status, _pagination) => {
  //     if (status === kakao.maps.services.Status.OK) {
  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
  //       // LatLngBounds 객체에 좌표를 추가합니다
  //       const bounds = new kakao.maps.LatLngBounds();
  //       let markers = [];

  //       for (var i = 0; i < data.length; i++) {
  //         // @ts-ignore
  //         markers.push({
  //           position: {
  //             lat: data[i].y,
  //             lng: data[i].x,
  //           },
  //           content: data[i].place_name,
  //         });
  //         // @ts-ignore
  //         bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
  //       }
  //       setMarkers(markers);

  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  //       map.setBounds(bounds);
  //     }
  //   });
  // }, [map, keyword]);
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
        style={{ width: "95%", height: "34vh" }}
        // level={3} // 지도의 확대 레벨
        onClick={(_t, mouseEvent) =>
          setFullAddress({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          })
        }
      >
        {/* 마커 */}
        {position && <MapMarker position={position} />}
        {/* {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))} */}
      </Map>
    </div>
  );
};

export default MakeMap;
// import React, { useState } from "react";
// import { Map, MapMarker } from "react-kakao-maps-sdk";

// const MakeMap = () => {
//   const [position, setPosition] = useState({ lat: 37.5, lng: 127 });

//   return (
//     <div style={{ width: "100%", height: "400px" }}>
//       <Map
//         center={{
//           lat: position.lat,
//           lng: position.lng,
//         }}
//         style={{
//           width: "100%",
//           height: "100%",
//         }}
//         level={3}
//         onClick={(_t, mouseEvent) => {
//           setPosition({
//             lat: mouseEvent.latLng.getLat(),
//             lng: mouseEvent.latLng.getLng(),
//           });
//         }}
//       >
//         {position && <MapMarker position={position} />}
//       </Map>
//     </div>
//   );
// };

// export default MakeMap;
