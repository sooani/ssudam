//마이페이지에서 보이는 나의 글 목록입니다.

//MyPost.jsx
import axios from '../axios';
import React, { useEffect, useState } from 'react';

const MyPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/v1/parties/?page=1&size=10&partyMemberid=2');
        // 여기에서 'title'만 추출
        const titles = response.data.map(post => post.title);
        setPosts(titles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // useEffect를 빈 배열로 전달하여 컴포넌트가 마운트될 때만 실행

  return (
    <div>
      <h2>글 제목 목록</h2>
      <ul>
        {posts.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyPost;