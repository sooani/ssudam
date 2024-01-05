// import React, { useEffect } from "react";

// const KakaoMap = () => {
//   useEffect(() => {
//     // Kakao 지도 API 초기화
//     const { kakao } = window;
//     kakao.maps.load(() => {
//       let container = document.getElementById("map");
//       let options = {
//         center: new kakao.maps.LatLng(37.566826, 126.9786567),
//         level: 3,
//       };
//       const map = new kakao.maps.Map(container, options);
//     });
//   }, []);

//   return (
//     <div id="map" style={{ width: "500px", height: "400px" }}>
//       {/* 여기에 지도가 렌더링 될 것입니다 */}
//     </div>
//   );
// };

// export default KakaoMap;
