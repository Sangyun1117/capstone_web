import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Grid,
  Container,
  IconButton,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { firestore } from '../firebaseConfig';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { MediaSideBar } from '../Problem/SideBar';

const LikedVideosScreen = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리할 새로운 상태 변수

  const userEmail = useSelector((state) => state.userEmail);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const navigate = useNavigate();

  const fetchVideos = async () => {
    const fetchedVideos = await fetchLikedVideos(userEmail);
    setVideos(fetchedVideos);
  };

  const fetchLikedVideos = async (userEmail) => {
    const likedVideos = [];
    try {
      const likedVideosSnapshot = await getDocs(
        collection(firestore, 'users', userEmail, 'LikedVideos')
      );
      if (!likedVideosSnapshot.empty) {
        likedVideosSnapshot.forEach((doc) => {
          likedVideos.push({ id: doc.id, ...doc.data() });
        });
      } else {
        console.log('No liked videos found');
      }
    } catch (e) {
      console.error('Error getting documents: ', e);
    } finally {
      return likedVideos;
    }
  };

  const removeFavorite = async (video) => {
    if (!isLoggedIn) {
      const confirm = window.confirm(
        '해당 영상을 즐겨 찾기에 삭제하실려면 로그인을 해주세요'
      );
      if (confirm) {
        navigate('/login');
      }
      return;
    }

    try {
      const userSnapshot = await getDoc(doc(firestore, 'users', userEmail));
      if (userSnapshot.exists()) {
        const docRef = collection(firestore, 'users', userEmail, 'LikedVideos');
        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((document) => {
          if (document.id === video.id) {
            deleteDoc(
              doc(firestore, 'users', userEmail, 'LikedVideos', document.id)
            )
              .then(() => {
                console.log('Document deleted with ID: ', document.id);
                window.alert('해당 영상이 즐겨찾기에서 삭제 되었습니다!');
                fetchVideos();
              })
              .catch((error) => {
                console.error('Error deleting document: ', error);
              });
          }
        });
      } else {
        console.error('User not found');
      }
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const confirm = window.confirm(
        '즐겨찾는 영상을 보실려면 로그인을 해주세요'
      );
      if (confirm) {
        navigate('/login');
      }
    } else {
      fetchVideos();
    }
  }, [userEmail]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <MediaSideBar />

      <Container maxWidth="xl" style={{ marginRight: '15%' }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h1"
            component="div"
            sx={{ fontWeight: 'bold', fontSize: 40, marginBottom: 5 }}
          >
            <AccessTime sx={{ fontSize: 40 }} /> 즐겨 찾기
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Grid container spacing={2} columns={16}>
              {videos.map((video, index) => (
                <Grid item xs={8} key={video.videoId}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <iframe
                      width="560"
                      height="315"
                      style={{transform: 'scale( 0.8)'}}
                      src={'https://www.youtube.com/embed/' + video.videoId}
                      title={'video-' + index}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => removeFavorite(video)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {isLoading && (
              <CircularProgress sx={{ marginTop: 2.5, marginBottom: 2.5 }} />
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LikedVideosScreen;
