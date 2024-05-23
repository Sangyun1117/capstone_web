import React, { useState } from 'react';
import Map from './Map';
import './EventMap.css'; // EventMap.css 파일 임포트
import { MediaSideBar } from '../Problem/SideBar';
const EventMap = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <MediaSideBar />

      <div className="event-map-container">
        <h1>사건지도</h1>
        <Map />
      </div>
    </div>
  );
};

export default EventMap;
