/*  |￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣|
    |  🤍그냥 페이지네이션 코드입니다🤍   |
    |           - 안민주 -         |
    |＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿|
　　            ᕱ ᕱ  ||
　           ( ᴖ ‧̫ ᴖ ||
  　         /　つ  Φ */

//Pagination.jsx
// import React from 'react';
// import classes from '../../styles/components/Pagination.module.css';
// import { Nav, Button } from 'react-bootstrap';

// function Pagination({ total, limit, page, setPage }) {
//     const numPages = Math.ceil(total / limit);
  
//     return (
//       < Nav className={classes.nav}>
//         <Button className={classes.button} onClick={() => setPage(page - 1)} disabled={page === 1}>
//           &lt;
//         </Button>
//           {Array(numPages)
//           .fill()
//           .map((_, i) => (
//             <Button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               aria-current={page === i + 1 ? "page" : undefined}
//               className={`${classes.button} ${page === i + 1 ? classes.currentPage : ''}`}
//             >
//               {i + 1}
//           </Button>
//           ))}
//           <Button
//             onClick={() => setPage(page + 1)}
//             disabled={page === numPages}
//             className={`${classes.button} ${classes.nextPage}`}
//           >
//             &gt;
//           </Button>
//       </Nav>
//     );
//   }

//   export default Pagination;


import React from 'react';
import classes from '../../styles/components/Pagination.module.css';
import { Nav, Button } from 'react-bootstrap';

function Pagination({ total, limit, page, setPage }) {
  const numPages = Math.ceil(total / limit);

  // Check if there is anything to display
  if (numPages <= 1) {
    return null; // 내용이 없으면 화면에 아무요소도 나타나지 않음!
  }

  return (
    <Nav className={classes.nav}>
      <Button className={classes.button} onClick={() => setPage(page - 1)} disabled={page === 1}>
        &lt; 
      </Button>
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <Button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : undefined}
            className={`${classes.button} ${page === i + 1 ? classes.currentPage : ''}`}
          >
            {i + 1}
          </Button>
        ))}
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        className={`${classes.button} ${classes.nextPage}`} // ">"버튼
      >
        &gt;
      </Button>
    </Nav>
  );
}

export default Pagination;
