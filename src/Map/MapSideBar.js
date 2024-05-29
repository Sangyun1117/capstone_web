import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventMap.css'; // EventMap.css 파일 임포트
import ReactMarkdown from 'react-markdown';
import { IconButton, Box } from '@mui/material';
import InputIcon from '@mui/icons-material/Input';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import rehypeRaw from 'rehype-raw';

const MapSideBar = ({ isOpen, onClose, eid }) => {
  const [content, setContent] = useState(null);
  const [contentBody, setContentBody] = useState('');
  const sidebarRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8080/character/' + eid) //
      .then((response) => response.json())
      .then((data) => {
        setContent(data.article);
        console.log('Received data:', data); // 데이터를 콘솔에 출력
      })
      .catch((error) => console.error('Error:', error));
  }, [eid]);

  useEffect(() => {
    if (content) {
      const body = content.body;
      const bodySlice = body.split(/(?=(?<!#)#(?!#))/); //body를 #이 하나인 경우를 기준으로 자름

      let textLength = 0; //글자수
      let limitedBody = ''; //글자수 제한 내의 바디 텍스트

      for (let i = 0; i < bodySlice.length; i++) {
        textLength += bodySlice[i].length;
        if (textLength <= 2000) {
          //2000자 제한
          limitedBody += bodySlice[i];
        } else {
          break;
        }
      }

      setContentBody(limitedBody);
    }
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const components = {
    h1: ({ node, ...props }) => (
      <div style={{ marginTop: '10px' }}>
        <br />
        <div
          className="map-sidebar-text"
          style={{ fontSize: '24px', fontWeight: 'bold' }}
          {...props}
        />
        <hr className="map-sidebar-border" />
      </div>
    ),
    h2: ({ node, ...props }) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          paddingBottom: '0.5%',
        }}
      >
        <span style={{ marginRight: '10px', marginBottom: '5px' }}>◎</span>
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

    table: ({ children, ...props }) => (
      <div style={{ textAlign: 'center', width: '100%' }}>
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
    <div ref={sidebarRef} className={`map-sidebar ${isOpen ? 'open' : ''}`}>
      {content && (
        <div style={{ alignItems: 'center' }}>
          <IconButton
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '50%',
              right: '88%',
              width: '15%',
              minWidth: '100px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 2501,
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 40, color: 'gray' }} />
          </IconButton>
          <div
            style={{
              paddingTop: '20px',
              paddingBottom: '20px',
              height: '10%',
              width: '100%',
              zIndex: 2500,
            }}
          >
            <h1
              style={{
                color: '#FF9100',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              {content.headword}
              <hr className="map-sidebar-hr" />
            </h1>
          </div>

          <div
            style={{
              width: '80%',
              height: '75%',
              paddingLeft: '10%',
              paddingRight: '10%',
              overflowY: 'auto',
            }}
          >
            {content.headMedia.url && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <img
                  src={content.headMedia.url}
                  alt=""
                  style={{
                    paddingTop: '10%',
                    paddingBottom: '10px',
                    width: '40%', // 이미지의 너비를 부모 요소에 맞춤
                    height: 'auto', // 높이도 부모 요소에 맞춤
                    objectFit: 'contain', // 이미지 비율을 유지하면서 전체 내용이 보이도록 조정
                  }}
                />
                <p>△{content.headMedia.caption}</p>
              </div>
            )}
            {content.definition && (
              <h2 style={{ marginTop: '20px' }} className="map-sidebar-text">
                정의
                <hr className="map-sidebar-border" />
              </h2>
            )}
            <p>{content.definition}</p>

            {content.summary && (
              <h2 style={{ marginTop: '20px' }} className="map-sidebar-text">
                요약
                <hr className="map-sidebar-border" />
              </h2>
            )}
            <p>{content.summary}</p>

            {contentBody && (
              <ReactMarkdown
                children={contentBody}
                rehypePlugins={[rehypeRaw]}
                components={components}
              />
            )}
          </div>
          <Box
            className="map-sidebar-detail-button"
            onClick={() =>
              navigate('/dictionary', { state: { content: content } })
            }
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <InputIcon sx={{ fontSize: 40, paddingRight: '10px' }} />
            <h1>용어사전 가기</h1>
          </Box>
        </div>
      )}
    </div>
  );
};

export default MapSideBar;
