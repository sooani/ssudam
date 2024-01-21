// // MyPosts.jsx
// import React, { useState, useEffect } from "react";
// import { useAxiosInterceptors } from "../../axios";
// // import useAxiosInstance from "../../axios";
// import Pagination from "./Pagination";
// import classes from "../../styles/components/MyPosts.module.css";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// function MyPosts() {
//   const [titles, settitles] = useState([]);
//   const [limit, setLimit] = useState(10);
//   const [page, setPage] = useState(1);
//   const offset = (page - 1) * limit;
//   const { memberId } = useParams();
//   const [size, setSize] = useState(10);
//   // const instance = useAxiosInstance();
//   const instance = useAxiosInterceptors();
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchComments = () => {
//       instance
//         // .get(`/v1/comments?memberId=${memberId}`)
//         .get(`/v1/parties`, { params: { memberId, page, limit, size } })
//         .then((response) => {
//           const extractedTitles = response.data.data.map(
//             (title) => title.title
//           );
//           settitles(extractedTitles);
//         })
//         .catch((error) => {
//           console.error(
//             "글제목 받아오기 오류!:",
//             error.response?.data || "알 수 없는 오류"
//           );
//         });
//     };

//     fetchComments();
//   }, [limit, page, memberId, size]);

//   return (
//     <div className={classes.MyPostsContainer}>
//       {titles.length === 0 ? (
//         <p className={classes.MyPostsMSG}>아직 작성한 글이 없습니다!😊</p>
//       ) : (
//         titles.slice(offset, offset + limit).map((title, index) => (
//           <article key={index}>
//             <p className={classes.Partytitle} onClick={() => navigate(`/v1/meetings/${title.id}`)}>
//               {title}</p>
//           </article>
//         ))
//       )}

//       <Pagination
//         total={titles.length}
//         limit={limit}
//         page={page}
//         setPage={setPage}
//       />
//     </div>
//   );
// }

// export default MyPosts;


// MyPosts.jsx
import React, { useState, useEffect } from "react";
import { useAxiosInterceptors } from "../../axios";
import Pagination from "./Pagination";
import classes from "../../styles/components/MyPosts.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const { memberId } = useParams();
  const [size, setSize] = useState(10);
  const instance = useAxiosInterceptors();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = () => {
      instance
        .get(`/v1/parties`, { params: { memberId, page, limit, size } })
        .then((response) => {
          setPosts(response.data.data);
        })
        .catch((error) => {
          console.error(
            "글제목 받아오기 오류!:",
            error.response?.data || "알 수 없는 오류"
          );
        });
    };

    fetchPosts();
  }, [limit, page, memberId, size]);

  return (
    <div className={classes.MyPostsContainer}>
      {posts.length === 0 ? (
        <p className={classes.MyPostsMSG}>아직 작성한 글이 없습니다!😊</p>
      ) : (
        posts.slice(offset, offset + limit).map((post, index) => (
          <article key={index}>
            <p
              className={classes.Partytitle}
              onClick={() => navigate(`/meetings/${post.partyId}`)}
            >
              {post.title}
            </p>
          </article>
        ))
      )}

      <Pagination
        total={posts.length}
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default MyPosts;
