import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/Map.module.css";
import { FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";

const SearchMap = (props) => {
  const { kakao } = window;
  // 마커가 위치한 장소의 정보
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [level, setLevel] = useState(4);
  const [map, setMap] = useState();
  const [position, setPosition] = useState({
    lat: props && props.lat ? props.lat : 33.450701,
    lng: props && props.lng ? props.lng : 126.570667,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  // const position = props.position;
  // const setPosition = props.setPosition;
  // console.log(position);
  // props로 받은 검색 키워드
  console.log(position);
  const keyword = props.searchkeyword;
  const setLatLng = props.setLatLng;
  const getAddress = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(lat, lng); // 주소로 변환할 좌표 입력
    const callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        // console.log(position.lat, position.lng);
        props.setAddress(result[0].address);
        console.log(result[0].address);
        // props.setAddress((prevAddress) => ({
        //   ...prevAddress,
        //   address_name: result[0].address,
        // }))
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    // console.log(address);
  };

  const handleMarkerClick = (position) => {
    // 클릭된 마커의 위도와 경도 출력
    setPosition(position.lat, position.lng);
    setLatLng({
      lat: position.lat,
      lng: position.lng,
    });
    console.log(position);

    getAddress(position.lat, position.lng);
    console.log("지도를 확대합니다.");
    // setLevel(1);
  };
  useEffect(() => {
    console.log(level);
  }, [level]);
  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    if (keyword) {
      ps.keywordSearch(keyword, (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          let markers = [];

          for (var i = 0; i < data.length; i++) {
            // @ts-ignore
            markers.push({
              position: {
                lat: data[i].y,
                lng: data[i].x,
              },
              content: data[i].place_name,
            });
            // @ts-ignore
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setMarkers(markers);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
        }
      });
    }
  }, [map, keyword]);
  const handleSidebarMarkerClick = (marker) => {
    const { lat, lng } = marker.position;
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    setSelectedMarker(marker);
    setLatLng({
      lat: lat,
      lng: lng,
    });

    getAddress(lat, lng);
    // setLevel(1);
  };

  return (
    <div className={classes.container}>
      <Map
        // center={{
        //   lat: 37.566826,
        //   lng: 126.9786567,
        // }}
        center={{
          lat: position.lat,
          lng: position.lng,
        }}
        style={{
          width: "90%",
          height: "37vh",
        }}
        level={level}
        onCreate={setMap}
        onClick={(_t, mouseEvent) => {
          handleMarkerClick({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          });
          // setLevel(1);
        }}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            // onMouseOver={setInfo(marker)}
            onClick={() => {
              handleMarkerClick(marker.position);
              setInfo(marker);
              setSelectedMarker(marker);
              // setLevel(1);
            }}
          >
            {/* {info && info.content === marker.content && (
              <div className={classes.info}>{marker.content}</div>
            )} */}
            {selectedMarker && selectedMarker.content === marker.content && (
              <div style={{ padding: "5px", color: "#000" }}>
                {marker.content} <br />
                <a
                  href={`https://map.kakao.com/link/map/${marker.content},${marker.position.lat},${marker.position.lng} `}
                  style={{ color: "blue" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  큰지도보기
                </a>
              </div>
            )}
          </MapMarker>
        ))}

        <div className={classes.sidebar}>
          {markers.map((marker, index) => (
            <div
              key={index}
              onClick={() => {
                handleSidebarMarkerClick(marker);
                // setLevel(1);
              }}
              style={{
                color:
                  selectedMarker && selectedMarker.content === marker.content
                    ? "black" // 변경하고 싶은 배경색을 여기에 지정하세요
                    : "gray",
              }}
            >
              {marker.content}
            </div>
          ))}
        </div>
      </Map>
    </div>
  );
};
export default SearchMap;
