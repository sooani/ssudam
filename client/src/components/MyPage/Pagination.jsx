/*  |￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣|
    |  🤍그냥 페이지네이션 코드입니다🤍   |
    |           - 안민주 -         |
    |＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿|
　　            ᕱ ᕱ  ||
　           ( ᴖ ‧̫ ᴖ ||
  　         /　つ  Φ */

//Pagination.jsx
import React from 'react';
import classes from '../../styles/components/Pagination.module.css';
import { Nav, Button } from 'react-bootstrap';

function Pagination({ total, limit, page, setPage }) {
    const numPages = Math.ceil(total / limit);
  
    return (
      < Nav className={classes.nav}>
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
            >
              {i + 1}
            </Button>
          ))}
        <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
          &gt;
        </Button>
      </Nav>
    );
  }

  export default Pagination;