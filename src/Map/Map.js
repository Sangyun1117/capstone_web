import React, { useEffect, useState } from 'react';
import mapData from './Map.json'; // JSON 파일에서 마커 데이터를 불러옴
import Select from 'react-select';
import MapSideBar from './MapSideBar';

const Map = () => {
  const [isMapSideBarOpen, setIsSideBarOpen] = useState(false);
  const [sidebarEid, setSidebarEid] = useState('');
  const handleSideBarOpen = (title) => {
    setIsSideBarOpen(true);
  };
  const handleSideBarClose = () => {
    setIsSideBarOpen(false);
  };

  const [selectedRange, setSelectedRange] = useState({
    value: '-9999~-18',
    label: '전삼국',
  });
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태 추가

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(38.5, 127.9), // 한반도의 대략적인 중심 좌표
      level: 13, // 적당한 줌 레벨
    };

    const map = new window.kakao.maps.Map(container, options);

    // 하나의 인포윈도우 인스턴스를 생성
    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    // mapData를 사용하여 각 위치에 마커 생성
    mapData.forEach((data) => {
      // 선택된 범위에 해당하는 데이터만 처리
      if (
        data.era >= Number(selectedRange.value.split('~')[0]) &&
        data.era <= Number(selectedRange.value.split('~')[1])
      ) {
        const markerPosition = new window.kakao.maps.LatLng(
          data.latitude,
          data.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map,
          title: data.title,
        });

        // 마커 클릭 이벤트에 인포윈도우를 표시하도록 설정
        window.kakao.maps.event.addListener(marker, 'click', () => {
          // 인포윈도우의 내용을 업데이트하고 해당 마커 위치에서 열기
          infowindow.setContent(
            `<div style="width:150px;text-align:center;padding:10px;">${data.title}</div><div style="width:150px;text-align:center;padding:10px; font-size:12px;">${data.description}</div>`
          );
          infowindow.open(map, marker);

          // 선택된 마커 업데이트
          setSelectedMarker(marker);
          handleSideBarOpen();
          setSidebarEid(data.eid);
        });
      }
    });

    // 맵 클릭 시 선택된 마커 해제
    window.kakao.maps.event.addListener(map, 'click', () => {
      if (selectedMarker) {
        infowindow.close(); // 인포윈도우 닫기
        setSelectedMarker(null); // 선택된 마커 해제
      }
    });
  }, [selectedRange]); // 선택된 범위가 변경될 때마다 다시 렌더링

  const handleChange = (selectedOption) => {
    setSelectedRange(selectedOption);
  };

  return (
    <div style={{ width: '70%' }}>
      {' '}
      {/* 부모 요소의 너비 설정 */}
      <div>
        <label htmlFor="range">년도 범위 선택:</label>
        <Select
          id="range"
          value={selectedRange}
          onChange={handleChange}
          options={[
            { value: '-9999~-18', label: '전삼국' },
            { value: '-17~697', label: '삼국' },
            { value: '698~897', label: '남북극' },
            { value: '898~935', label: '후삼국' },
            { value: '936~1391', label: '고려' },
            { value: '1392~1896', label: '조선' },
            { value: '1897~1909', label: '개항기' },
            { value: '1910~1945', label: '일제강점기' },
            { value: '1945~9999', label: '해방이후' },
          ]}
          styles={{ container: (provided) => ({ ...provided, zIndex: '999' }) }}
        />
      </div>
      <div
        id="map"
        style={{ width: '100%', height: '600px', cursor: 'pointer' }}
      ></div>
      <MapSideBar
        isOpen={isMapSideBarOpen}
        onClose={handleSideBarClose}
        eid={sidebarEid}
      />
    </div>
  );
};

export default Map;
