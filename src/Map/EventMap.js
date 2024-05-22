import React, { useState } from 'react';
import Map from './Map';
import './EventMap.css'; // EventMap.css 파일 임포트
const EventMap = () => {
  return (
    <div className="event-map-container">
      <h1>사건지도</h1>
      <Map />
    </div>
  );
};

export default EventMap;
