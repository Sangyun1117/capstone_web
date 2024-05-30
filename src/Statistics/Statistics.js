import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js v3 이상에서 필요
import './Statistics.css';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import 'chartjs-plugin-datalabels';
import { MyPageSideBar, ProblemSideBar } from '../Problem/SideBar';

const Statistics = () => {
  const navigate = useNavigate();
  const [eraData, setEraData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [total, setTotal] = useState(0);
  const [wrongProblemsCount, setWrongProblemsCount] = useState(0);

  //로그인 관리
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail'); // 로컬 스토리지에서 userEmail을 가져옴
    if (!userEmail) {
      alert('로그인 후 이용해주세요.');
      navigate('/login'); // 사용자를 로그인 페이지로 리디렉션합니다.
      return; // 리디렉션 후에는 이후 로직을 실행하지 않도록 함수를 종료합니다.
    }

    // 로그인이 확인되었을 때만 데이터를 불러오는 로직 실행
    const fetchData = async () => {
      const docRef = doc(
        firestore,
        'users',
        userEmail,
        'wrongStatistics',
        'data'
      );
      const docSnap = await getDoc(docRef);
      const wrongProblemsCollectionRef = collection(
        firestore,
        'users',
        userEmail,
        'wrongProblems'
      );
      const querySnapshot = await getDocs(wrongProblemsCollectionRef);
      if (docSnap.exists()) {
        setEraData(docSnap.data().era);
        const types = docSnap.data().type.filter((_, index) => index !== 7);
        setTypeData(types);
        setWrongProblemsCount(querySnapshot.docs.length);
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, [navigate]); // navigate를 의존성 배열에 추가합니다.

  useEffect(() => {
    const sum = eraData.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    setTotal(sum);
  }, [eraData]);

  const accuracyRate =
    total > 0 ? (((total - wrongProblemsCount) / total) * 100).toFixed(2) : 0;

  //시대별 막대그래프
  const eradata = {
    labels: [
      '전삼국',
      '삼국',
      '남북국',
      '후삼국',
      '고려',
      '조선',
      '개항기',
      '일제강점기',
      '해방이후',
    ],
    datasets: [
      {
        label: '시대별 통계',
        data: eraData, // Firestore에서 불러온 era 데이터
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          // 추가적인 색상 (생략)
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          // 추가적인 색상 (생략)
        ],
        borderWidth: 1,
      },
    ],
  };

  //시대별 원 그래프
  const eradataCiecle = {
    labels: [
      '전삼국',
      '삼국',
      '남북국',
      '후삼국',
      '고려',
      '조선',
      '개항기',
      '일제강점기',
      '해방이후',
    ],
    datasets: [
      {
        label: '시대별 통계',
        data: eraData, // Firestore에서 불러온 era 데이터
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        borderWidth: 1,
      },
    ],
  };

  //유형별 막대그래프
  const dataType = {
    labels: [
      '문화',
      '유물',
      '사건',
      '인물',
      '장소',
      '그림',
      '제도',
      '기구',
      '조약',
      '단체',
    ],
    datasets: [
      {
        label: '유형별 통계',
        data: typeData, // Firestore에서 불러온, 7번 인덱스가 제외된 type 데이터
        backgroundColor: 'rgba(205, 127, 50, 0.2)', // 브론즈 색상의 RGBA 값
        borderColor: 'rgba(205, 127, 50, 1)', // 브론즈 색상의 RGBA 값
        borderWidth: 1,
      },
    ],
  };

  //유형별 원그래프
  const dataTypeCiecle = {
    labels: [
      '문화',
      '유물',
      '사건',
      '인물',
      '장소',
      '그림',
      '제도',
      '기구',
      '조약',
      '단체',
    ],
    datasets: [
      {
        label: '유형별 통계',
        data: typeData, // Firestore에서 불러온, 7번 인덱스가 제외된 type 데이터
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true, // y축의 시작점을 0으로 설정
      },
    },
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // 데이터 라벨의 배경색
        borderRadius: 3,
        color: 'black', // 데이터 라벨의 글자색
        formatter: (value) => {
          return value; // 표시할 값
        },
      },
    },
  };
  //최소값 인덱스 구하는 변수
  // let minValueIndex =
  //   eraData.length > 0 ? eraData.indexOf(Math.min(...eraData)) : -1;
  // let minTypeIndex =
  //   typeData.length > 0 ? typeData.indexOf(Math.min(...typeData)) : -1;

  //   let minEraLabel =
  //   minValueIndex >= 0 ? eradata.labels[minValueIndex] : '데이터 없음';
  // let minTypeLabel =
  //   minTypeIndex >= 0 ? dataType.labels[minTypeIndex] : '데이터 없음';
  let maxValueIndex =
    eraData.length > 0 ? eraData.indexOf(Math.max(...eraData)) : -1;
  let maxTypeIndex =
    typeData.length > 0 ? typeData.indexOf(Math.max(...typeData)) : -1;

  let maxEraLabel =
    maxValueIndex >= 0 ? eradata.labels[maxValueIndex] : '데이터 없음';
  let maxTypeLabel =
    maxTypeIndex >= 0 ? dataType.labels[maxTypeIndex] : '데이터 없음';

  console.log(eraData);
  console.log(typeData);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <MyPageSideBar />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '60%',
        }}
      >
        {total !== 0 && (
          <div style={{ flex: 1 }}>
            {/* 통계 정보 섹션 */}
            <div className="statistics-info-container">
              <h2>오답 통계 정보</h2>
              <p style={{ marginTop: 30 }}>
                틀린 문제의 수: {wrongProblemsCount}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold', fontSize: '17px' }}>
                  {maxEraLabel}
                </strong>
                시대와
                <strong style={{ fontWeight: 'bold', fontSize: '17px' }}>
                  {' '}
                  {maxTypeLabel}
                </strong>
                유형의 학습이 부족합니다.
              </p>
              <button
                className="statistics-button"
                onClick={() => navigate(`/eraProblem/era${maxValueIndex + 1}`)}
              >{`${maxEraLabel} 공부하러 가기`}</button>
              <button
                className="statistics-button"
                onClick={() => navigate(`/typeProblem/type${maxTypeIndex + 1}`)}
              >{`${maxTypeLabel} 공부하러 가기`}</button>
            </div>

            {/* 시대별 통계 섹션 */}
            <div className="statistics-era-section">
              <h2>시대별 오답 통계</h2>
              <div className="statistics-chart-container">
                <div className="statistics-chart">
                  <h3>시대별 오답 막대 그래프</h3>
                  <Bar data={eradata} options={options} />
                </div>
                <div className="statistics-chart">
                  <h3>시대별 오답 원 그래프</h3>
                  <Doughnut data={eradataCiecle} />
                </div>
              </div>
            </div>

            {/* 유형별 통계 섹션 */}
            <div className="statistics-type-section">
              <h2>유형별 오답 통계</h2>
              <div className="statistics-chart-container">
                <div className="statistics-chart">
                  <h3>유형별 오답 막대 그래프</h3>
                  <Bar data={dataType} options={options} />
                </div>
                <div className="statistics-chart">
                  <h3>유형별 오답 원 그래프</h3>
                  <Doughnut data={dataTypeCiecle} />
                </div>
              </div>
            </div>
          </div>
        )}

        {total === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1 style={{ marginTop: 100 }}>문제풀이 데이터가 없습니다.</h1>
            <div style={{ marginTop: '10%' }}>
              <button
                className="statistics-button"
                onClick={() => navigate(`/practiceRoundSelect`)}
              >
                {`기출문제 공부하러 가기`}
              </button>
              <button
                className="statistics-button"
                onClick={() => navigate(`/eraProblem/era1`)}
              >
                {`시대별 공부하러 가기`}
              </button>
              <button
                className="statistics-button"
                onClick={() => navigate(`/typeProblem/type1`)}
              >
                {`유형별 공부하러 가기`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
