import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/Map.module.css";
const SearchMap = (props) => {
  const { kakao } = window;
  // 마커가 위치한 장소의 정보
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [position, setPosition] = useState({ lat: 33.450701, lng: 126.570667 });

  // props로 받은 검색 키워드
  const keyword = props.searchkeyword;

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

  const handleMarkerClick = (position) => {
    // 클릭된 마커의 위도와 경도 출력
    setPosition(position.lat, position.lng);
    getAddress(position.lat, position.lng);
  };

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

  return (
    <div className={classes.container}>
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "90%",
          height: "37vh",
        }}
        level={3}
        onCreate={setMap}
        onClick={(_t, mouseEvent) =>
          handleMarkerClick({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          })
        }
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => {
              handleMarkerClick(marker.position);
              setInfo(marker);
            }}
          >
            {info && info.content === marker.content && (
              <div className={classes.info}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
    </div>
  );
};
export default SearchMap;
