import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import classes from "../../styles/components/SearchMap.module.css";
const SearchMap = (props) => {
  const { kakao } = window;
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [position, setPosition] = useState({ lat: 33.450701, lng: 126.570667 });
  //   const [keyword, setKeyword] = useState(props.searchkeyword);
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
    console.log("클릭된 마커의 위도:", position.lat);
    console.log("클릭된 마커의 경도:", position.lng);
    setPosition(position.lat, position.lng);
    getAddress(position.lat, position.lng);
    // 다른 작업 수행 가능
    // ...
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
      <Map // 로드뷰를 표시할 Container
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "95%",
          height: "34vh",
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
            // onClick={() => setInfo(marker)}
            onClick={() => {
              handleMarkerClick(marker.position);
              setInfo(marker);
            }}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
    </div>
  );
};
export default SearchMap;
