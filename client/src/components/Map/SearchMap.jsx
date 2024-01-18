import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/Map.module.css";

const SearchMap = (props) => {
  const { kakao } = window;
  // 마커가 위치한 장소의 정보
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]); // 마커들
  const [level, setLevel] = useState(4); // 확대 레벨
  const [map, setMap] = useState(); // 지도 설정
  const [position, setPosition] = useState({
    lat: 33.450701,
    lng: 126.570667,
  });
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커

  const keyword = props.searchkeyword;
  const setLatLng = props.setLatLng;

  // 도로명 주소를 얻는 메소드
  const getAddress = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(lat, lng); // 주소로 변환할 좌표 입력
    const callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        props.setAddress(result[0].address); // 도로명 주소 설정
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };
  // 클릭된 마커를 이용하는 메서드
  const handleMarkerClick = (position) => {
    // 클릭된 마커의 위도와 경도 뽑아오기
    setPosition(position.lat, position.lng);
    setLatLng({
      lat: position.lat,
      lng: position.lng,
    });

    // 설정된 위도와 경도로 도로명 주소 설정
    getAddress(position.lat, position.lng);
  };

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();
    // 키워드가 존재하면
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
  // 검색 목록에서 클릭했을 경우 위도와 경도를 설정하는 메서드
  const handleSidebarMarkerClick = (marker) => {
    const { lat, lng } = marker.position;
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    // 클릭된 위도와 경도로 (마커 위치로) 이동
    map.panTo(moveLatLon);
    setSelectedMarker(marker);
    setLatLng({
      lat: lat,
      lng: lng,
    });

    getAddress(lat, lng);
  };

  return (
    <div className={classes.container}>
      <Map
        center={{
          lat: props.lat ? props.lat : 37.566826,
          lng: props.lng ? props.lng : 126.9786567,
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
        }}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => {
              handleMarkerClick(marker.position);
              setInfo(marker);
              setSelectedMarker(marker);
            }}
          >
            {/* 선택된 마커이면 마커의 정보를 보여준다 */}
            {selectedMarker && selectedMarker.content === marker.content && (
              <div style={{ padding: "5px", color: "#000" }}>
                {marker.content} <br />
                <a
                  href={`https://map.kakao.com/link/map/${marker.content},${marker.position.lat},${marker.position.lng} `}
                  style={{ color: "#86b6f6" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  큰지도보기
                </a>
              </div>
            )}
          </MapMarker>
        ))}
        {/* 모임 글 수정의 경우 기존의 위치를 처음에 마커로 찍어준다 */}
        {props.lat && props.lng && (
          <MapMarker position={{ lat: props.lat, lng: props.lng }} />
        )}
        {/* 검색 목록이 나오는 리스트 */}
        <div className={classes.sidebar}>
          {markers.map((marker, index) => (
            <div
              key={index}
              onClick={() => {
                handleSidebarMarkerClick(marker);
              }}
              style={{
                color:
                  selectedMarker && selectedMarker.content === marker.content
                    ? "black"
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
