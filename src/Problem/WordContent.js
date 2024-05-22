import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
const WordContent = ({ eid, boxWidth = '60%' }) => {
  const [word, setWord] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8080/character/' + eid) //E0030144
      .then((response) => response.json())
      .then((data) => {
        setWord(data.article);
        console.log('Received data:', data); // 데이터를 콘솔에 출력
      })
      .catch((error) => console.error('Error:', error));

    console.log('id' + eid);
  }, [eid]);

  const components = {
    h1: ({ node, ...props }) => (
      <div style={{ paddingBottom: '0.5%' }}>
        <br />
        <div style={{ fontSize: '2em', fontWeight: 'bold' }} {...props} />
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
    <Box
      style={{
        width: boxWidth,
        paddingTop: '5%',
        paddingBottom: '5%',
      }}
    >
      {word && (
        <div>
          <h1>{word.headword}</h1>
          <hr />
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
                maxHeight: '300px', // 예를 들어 최대 높이를 200px로 설정
                maxWidth: '300px', // 최대 너비도 200px로 설정
                textAlign: 'center',
              }}
            >
              <img
                src={word.headMedia.url}
                alt=""
                style={{
                  width: '100%', // 이미지의 너비를 부모 요소에 맞춤
                  height: '100%', // 높이도 부모 요소에 맞춤
                  objectFit: 'contain', // 이미지 비율을 유지하면서 전체 내용이 보이도록 조정
                }}
              />
              {word.headMedia.caption && <p>△{word.headMedia.caption}</p>}
            </div>

            <div>
              <p style={{ marginBottom: '3%' }}>이름 : {word.headword}</p>
              <p style={{ marginBottom: '3%' }}>정의 : {word.definition} </p>
              {word.attributes.map((attribute, index) => {
                return (
                  <p key={index} style={{ marginBottom: '3%' }}>
                    {attribute.attrName} : {attribute.attrValue}
                  </p>
                );
              })}
            </div>
          </div>
          {word.summary && <h1>요약</h1>}
          <p>{word.summary}</p>
          <ReactMarkdown
            children={word.body}
            rehypePlugins={[rehypeRaw]}
            components={components}
          />
        </div>
      )}
    </Box>
  );
};

export default WordContent;
