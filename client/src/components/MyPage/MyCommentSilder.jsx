// MyCommentSlider.jsx

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from '../../axios';

const MySlider = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = () => {
      axios.get('v1/members/{member-id}/posts')
        .then(response => {
          setPosts(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('사용자의 글을 가져오는 중 오류 발생', error);
        });
    };

    fetchUserPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div>
      <Slider {...settings}>
        {posts.map((post, index) => (
          <div key={index}>
            <h3>{post.title}</h3>
            {/* <p>{post.content}</p> */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MySlider;