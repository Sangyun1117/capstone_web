import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Select, MenuItem, FormControl, Button, CircularProgress, Card, CardActions, Grid, Container, Modal, List, ListItem, IconButton, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { AccessTime, FormatListBulleted} from '@mui/icons-material';
import { MultipleSelect } from 'react-select-material-ui';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';


import { firestore } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs, orderBy, query, deleteDoc, updateDoc } from 'firebase/firestore';

import RecommendIcon from '@mui/icons-material/Recommend';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const options = [
    '문화', '유물', '사건', '인물', '장소', '그림', '제도', '기구', '조약', '단체'
];

const periods = [
    '고조선', '삼국', '남북국 시대', '후삼국', '고려', '조선', '개항기', '일제강점기', '해방 이후'
];


const HistoryTalesScreen = () => {
    const [videos, setVideos] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState('고조선');
    const [selectedTypeKeywords, setSelectedTypeKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리할 새로운 상태 변수
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();

    const [selectedVideo, setselectedVideo] = useState(null);

    const userEmail = useSelector((state) => state.userEmail);
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    
    const addFavorite = async (video) => {


        if (!isLoggedIn) {
            const confirm = window.confirm('해당 영상을 즐겨 찾기에 추가하실려면 로그인을 해주세요');
            if (confirm) {
                navigate('/login');
            }
            return;
        }

        try {
            const userSnapshot = await getDoc(doc(firestore, "users", userEmail));
            if (userSnapshot.exists()) {
                addDoc(collection(firestore, "users", userEmail, "LikedVideos"), {
                    videoId: video.videoId,
                })
                    .then((docRef) => {

                        alert('성공적으로 영상을 즐겨찾기에 저장하였습니다!')
                        console.log("Document written with ID: ", docRef.id);

                    })
                    .catch((e) => {
                        console.error("Error adding document: ", e);
                    });
            } else {
                console.error("User not found");
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    };

    const fetchVideos = async () => {

        setIsLoading(true); //로딩 시작

        let filteredDocs = [];

        try {
            const snapshot = await getDocs(collection(firestore, 'Videos'));
            snapshot.forEach((doc) => {
                let data = doc.data();
                let categories = data.category;

                for (let i = 0; i < categories.length; i++) {

                    if (selectedTypeKeywords.includes(categories[i]) || selectedKeyword === categories[i]) {

                        filteredDocs.push(data);
                        break;
                    }
                }
            });

            setVideos(filteredDocs);

        } catch (error) {
            console.error("Error getting documents: ", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };



    const fetchComments = async (video) => {


        const snapshot = await getDocs(collection(firestore, 'Videos'));

        let commentsArray = [];

        for (const document of snapshot.docs) {
            const data = document.data();

            if (data.videoId === video.videoId) {
                const commentsSnapshot = await getDocs(query(collection(firestore, `Videos/${document.id}/comments`), orderBy("created", "desc")));
                commentsSnapshot.forEach(doc => {
                    commentsArray.push({
                        docId: doc.id,
                        comment: doc.data().comment,
                        userEmail: doc.data().userEmail,
                        created: doc.data().created
                    });
                });
            }
        }

        return commentsArray;
    }

    const submitComments = async () => {
        const snapshot = await getDocs(collection(firestore, 'Videos'));
    
        for (const document of snapshot.docs) {
            const data = document.data();
            if (data.videoId === selectedVideo.videoId) {
                try {
                    await addDoc(collection(firestore, `Videos/${document.id}/comments`), {
                        comment: comment,
                        userEmail: userEmail,
                        created: new Date()
                    });
                    const comments = await fetchComments(selectedVideo);
                    setComments(comments);
                    setComment("");
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        }
    }


    const deleteComment = async (commentDocId) => {
        const snapshot = await getDocs(collection(firestore, 'Videos'));

        for (const document of snapshot.docs) {
            const data = document.data();
            if (data.videoId === selectedVideo.videoId) {
                try {
                    await deleteDoc(doc(firestore, `Videos/${document.id}/comments`, commentDocId));
                    const comments = await fetchComments(selectedVideo);
                    setComments(comments);
                    setComment("");
                } catch (e) {
                    console.error("Error delete document: ", e);
                }
            }
        }
        
    };

    const addLike = async (video) => {

        if (!isLoggedIn) {
            const confirm = window.confirm('해당 영상을 좋아요 하실려면 로그인을 해주세요');
            if (confirm) {
                navigate('/login');
            }
            return;
        }

        try {
            const snapshot = await getDocs(collection(firestore, 'Videos'));

            snapshot.forEach((document) => {
                

                const data = document.data();

                if (data.videoId === video.videoId) {
                
                    const currentLikes = data.like;

                    if(currentLikes.includes(userEmail)) {

                        window.alert(
                            '이미 해당 영상을 성공적으로 좋아요 했습니다!'
                        );


                        return;

                    }

                    const updatedLikes = [...currentLikes, userEmail];


                    updateDoc(doc(firestore, 'Videos', document.id), {
                        like: updatedLikes
                    }).then(() => {
                        window.alert('해당 영상을 성공적으로 좋아요 했습니다!'
                        );

                        fetchVideos();
                    }).catch((e) => {
                        console.error("Error updating document: ", e);
                    });
                }
            });
        } catch (e) {
            console.error("Error like document: ", e);
        }

    };


 
    useEffect(() => {
        fetchVideos();
    }, [selectedKeyword, selectedTypeKeywords]);

    return (
        <Container maxWidth="xl">
       
        <Box sx={{ p: 2 }}>
            <Typography variant="h1" component="div" sx={{ fontWeight: 'bold', fontSize: 40, marginBottom: 5 }}>
                <AccessTime sx={{ fontSize: 40 }} /> 역사 이야기
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                    <AccessTime /> 시대 별
                </Typography>

                <FormControl fullWidth>
                    <Select
                        value={selectedKeyword}
                        onChange={(event) => setSelectedKeyword(event.target.value)}
                        sx={{ mb: 3 }}
                    >
                        {periods.map((period, index) => (
                            <MenuItem key={index} value={period}>{period}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: 20, mb: 2 }}>
                    <FormatListBulleted /> 유형 별
                </Typography>
                <MultipleSelect
                    options={options}
                    onChange={setSelectedTypeKeywords}
                />
            </Box>

            <Box sx={{ flexGrow: 1,  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={2} columns={16}>

                    {videos.map((video, index) => (
                        <Grid item xs={8} key={video.videoId}>
                            <Card sx={{ p: 3, m: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={"https://www.youtube.com/embed/" + video.videoId}
                                    title={"video-" + index}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                                <CardActions>
                                    <Button sx={{color: 'black'}} startIcon={<RecommendIcon/>} onClick ={()=> addLike(video)} >
                                        좋아요 {`${video.like.length}`}
                                    </Button>
                                    <Button sx={{color: 'black'}} startIcon={<ChatBubbleIcon/>} onClick={async () => {

                                        const comments = await fetchComments(video);
                                        setComments(comments);
                                        setselectedVideo(video)
                                        handleOpen();
                                    }}>
                                        댓글
                                    </Button>
                                    <Button sx={{color: 'black'}} startIcon={<BookmarkBorderIcon />} onClick={() => addFavorite(video)}>
                                        저장하기
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {isLoading && <CircularProgress sx={{marginTop: 2.5, marginBottom: 2.5}}/>}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxHeight: '500px', // 최대 높이 설정
                        overflow: 'auto' // 내용이 최대 높이를 초과할 경우 스크롤 가능
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize: 30}}>
                            <CommentIcon sx={{color: 'black'}} /> 댓글
                        </Typography>



                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={comment}
                                onChange={handleCommentChange}
                                margin="normal"
                                placeholder={
                                    isLoggedIn ? '댓글을 작성해주세요!' : '로그인하고 댓글을 작성해주세요!'
                                }
                                disabled={!isLoggedIn}
                            />

                            <IconButton edge="end" aria-label="send" sx={{ color: 'black' }} onClick={submitComments}>
                                <SendIcon sx={{ color: 'black' }}/>
                            </IconButton>

                        </Box>

                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.docId} alignItems="flex-start">
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'white', color: 'black' }}>
                                        <CommentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    </Grid>
                                    <Grid item xs>
                                    <Typography variant="body1" color="text.primary">
                                        {comment.comment}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {comment.userEmail}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(comment.created.seconds * 1000).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </Typography>
                                    </Grid>
                                    {comment.userEmail === userEmail && (
                                    <Grid item>
                                        <IconButton edge="end" aria-label="delete" color="error" onClick={() => deleteComment(comment.docId)}>
                                        <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                    )}
                                </Grid>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Modal>
            </Box>
        </Box>
    </Container>
    );
};

export default HistoryTalesScreen;