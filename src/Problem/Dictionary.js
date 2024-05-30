//import { ENCY_KOREA_KEY } from '../config/encyKoreaKey';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useLocation } from 'react-router-dom';
import { MediaSideBar } from '../Problem/SideBar';
import '../css/Problem.css';

export default function Dictionary() {
  const location = useLocation();
  const { id } = location.state;
  const aleradyContent = location.state.content;
  const [content, setContent] = useState(null);
  const serverPath = useSelector((state) => state.serverPath);

  const getContent = () => {
    fetch(serverPath + 'character/' + id) //E0030144
      //fetch('http://localhost:8080/character/' + id) //E0030144
      .then((response) => response.json())
      .then((data) => {
        setContent(data.article);
        console.log('Received data:', data); // 데이터를 콘솔에 출력
      })
      .catch((error) => console.error('Error:', error));

    console.log('id' + id);
  };
  useEffect(() => {
    if (aleradyContent) {
      setContent(aleradyContent);
    } else {
      getContent();
    }
  }, []);

  const components = {
    h1: ({ node, ...props }) => (
      <div style={{ paddingBottom: '0.5%' }}>
        <br />
        <div
          className="dictionary-text"
          style={{ fontSize: '2em', fontWeight: 'bold' }}
          {...props}
        />
      </div>
    ),
    h2: ({ node, ...props }) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          paddingTop: '1%',
          paddingBottom: '0.5%',
        }}
      >
        <span style={{ marginRight: '10px' }}>■</span>
        <div {...props} />
      </div>
    ),
    p: ({ node, ...props }) => (
      <div>
        <div {...props} />
        <br />
      </div>
    ),
    img: ({ src, alt, ...props }) => (
      <div style={{ textAlign: 'center' }}>
        <img
          src={src}
          {...props}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    ),

    figcaption: ({ children, ...props }) => (
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        △ {children}
      </div>
    ),
    table: ({ children, caption, ...props }) => (
      <div style={{ textAlign: 'center', width: '100%', marginBottom: '15px' }}>
        <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        style={{
          backgroundColor: 'lightgray',
          padding: '10px',
          border: '1px solid gray',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props} style={{ padding: '10px', border: '1px solid gray' }}>
        {children}
      </td>
    ),
    object: ({ data, type, ...props }) => (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <object
          data={data}
          type={type || 'application/pdf'}
          {...props}
          style={{ width: '80%', height: '500px' }}
        ></object>
      </div>
    ),
    // 링크 요소를 처리하는 함수
    a: ({ children }) => <span>{children}</span>,
  };
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <MediaSideBar />
      <Box
        style={{
          width: '60%',
          minWidth: '800px',
          paddingTop: '5%',
          paddingBottom: '5%',
        }}
      >
        {content && (
          <div>
            <h1 className="dictionary-text">{content.headword}</h1>
            <div className="hr-container">
              <hr className="dictionary-hr" />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '5%',
                paddingBottom: '5%',
              }}
            >
              <div
                style={{
                  height: '300px',
                  width: '30%',
                  paddingLeft: '10%',
                  paddingRight: '5%',
                  maxHeight: '300px',
                  maxWidth: '300px',
                  textAlign: 'center',
                }}
              >
                {content.headMedia.url ? (
                  <img
                    src={content.headMedia.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // 이미지 비율을 유지하면서 전체 내용이 보이도록 조정
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#e9e9e9',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    이미지없음
                  </div>
                )}
                {content.headMedia.caption && (
                  <p>△{content.headMedia.caption}</p>
                )}
              </div>

              <div>
                <p style={{ marginBottom: '3%' }}>이름 : {content.headword}</p>
                <p style={{ marginBottom: '3%' }}>
                  정의 : {content.definition}{' '}
                </p>
                {content.attributes.map((attribute, index) => {
                  return (
                    <p key={index} style={{ marginBottom: '3%' }}>
                      {attribute.attrName} : {attribute.attrValue}
                    </p>
                  );
                })}
              </div>
            </div>
            {content.summary && <h1 className="dictionary-text">요약</h1>}
            <p>{content.summary}</p>
            <ReactMarkdown
              children={content.body}
              rehypePlugins={[rehypeRaw]}
              components={components}
            />
          </div>
        )}
      </Box>
    </Box>
  );
}
