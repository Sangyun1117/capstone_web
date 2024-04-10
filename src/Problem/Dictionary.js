//import { ENCY_KOREA_KEY } from '../config/encyKoreaKey';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function Dictionary() {
  const [history, setHistory] = useState('');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/history') // 스프링 부트 앱의 주소와 포트를 확인하세요.
      .then((response) => response.json())
      .then((data) => setHistory(data.message))
      .catch((error) => console.error('There was an error!', error));
  }, []); // 빈 의존성 배열을 사용하여 컴포넌트 마운트 시에만 요청을 보냅니다.
  useEffect(() => {
    fetch('http://localhost:8080/articles/1')
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
        console.log('Received data:', data); // 데이터를 콘솔에 출력
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  /*const [data, setData] = useState(null);
  const API_KEY = ENCY_KOREA_KEY;
  const url = 'https://suny.aks.ac.kr:5143/api/Article/List/10';
  const headers = {
    Authorization: `accessKey=${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      console.log('contentType: ' + contentType);
      if (contentType && contentType.includes('application/json')) {
        const newData = await response.json();
        setData(newData);
      } else {
        const textData = await response.text();
        console.log('Non-JSON response:', textData);
        setData(textData);
        //throw new Error('Response is not in JSON format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
*/
  return (
    <div>
      hi{history}
      {/*ata ? <div>aaaaaaaaaa{data}ggggggggg</div> : <div>Loading...</div>*/}
      {Array.isArray(articles) &&
        articles.map((article) => (
          <div key={article.eid}>
            <p>
              {article.eid} {article.headword}
            </p>
          </div>
        ))}
    </div>
  );
}
