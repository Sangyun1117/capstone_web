import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto; // 내용이 길어지면 화면이 길어지게 한다.
  width: 60%;
  min-width: 800px;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 40%;
  padding: 10px;
`;

const TitleArea = styled.div`
  font-size: 30px;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #e6e6fa;
`;

const TopUIContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 5px;
  border-radius: 10px;
  margin-bottom: 50px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => props.backgroundcolor};

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px ${(props) => props.shadowcolor};
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px ${(props) => props.shadowcolor};
  }
`;

const PostBody = styled.div`
  margin-top: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  min-height: 400px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 50%;
  padding: 10px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  margin: 5px 0px;
  padding: 10px;
  min-height: 50px;
`;

const Line = styled.div`
  display: flex;
  background-color: #7bb4e3;
  height: 10px;
  margin: 10px;
  border-radius: 20px;
`;

const CommentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubmitButton = styled.button`
  display: flex;
  width: 70px;
  height: 50px;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #e6e6fa;
  border-color: #4b3e9a;
  border-width: 1px;
  border-radius: 5px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 0px black;
  border: none;
  font-size: 1em;
  &:hover {
    box-shadow: 0px 0px 0px 5px black;
  }
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const CommentInput = styled.input`
  height: 50px;
  width: 100%;
  border: 1px solid gray;
  border-radius: 5px;
  margin-right: 10px;
  padding-left: 5px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
  background-color: white;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.4em;
  width: 300px;
  padding: 10px;
  margin: 0px calc((100% - 300px) / 2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const CreateInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

// 게시판 글 클릭했을 때 내용 보이는 화면
const PostDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [userName, setUserName] = useState();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);
  const { boardName, post } = location.state;
  const postCreatingTime = formatDate(post.postId.split('_')[1]);
  const serverPath = 'http://localhost:8080/';

  // 작성 시각 변환기
  function formatDate(date) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(
      date
    );
    return formattedDate
      .replace(/\. /g, '-')
      .replace(/\./g, '')
      .replace(/, /g, ' ');
  }

  const getBoardDisplayName = (boardName) => {
    switch (boardName) {
      case 'questionBoard':
        return '질문';
      case 'tipBoard':
        return '팁';
      case 'reviewBoard':
        return '시험 후기';
      default:
        return '';
    }
  };
  const boardDisplayName = getBoardDisplayName(boardName);

  useEffect(() => {
    if (userEmail) {
      setUserName(userEmail.split('@')[0]);
    }
  }, [userEmail]);

  // 댓글 가져오기
  const fetchComments = () => {
    axios
      .get(serverPath + 'comments', { params: { postId: post.postId } })
      .then((response) => {
        const data = response.data;
        if (data) {
          const comments = Object.keys(data).map((key) => ({
            id: data[key].id,
            commentId: data[key].commentId,
            userEmail: data[key].userEmail,
            comment: data[key].comment,
          }));
          setCommentList(comments);
        }
      })
      .catch((error) => {
        console.error('Comments data could not be fetched.' + error);
      });
  };

  useEffect(() => {
    // 댓글 가져오기
    fetchComments();
  }, []);

  const handleSubmit = () => {
    // 댓글 저장
    if (comment.trim() === '') {
      // 댓글 내용이 없으면 저장하지 않음
      return;
    }
    if (comment.length > 500) {
      swal({
        title: '경고',
        text: '댓글은 최대 500자 입니다.',
        icon: 'warning',
        dangerMode: true,
      });
      return; // 함수 실행을 여기서 중단
    }
    const commentId = userName + '_' + Date.now();

    // post와 post.postId가 존재하는지 확인
    if (!post || !post.postId) {
      console.error('Post or post.postId is undefined.');
      return;
    }

    const newComment = {
      commentId: commentId,
      userEmail: userEmail,
      comment: comment,
      postId: post.postId,
    };

    axios
      .post(serverPath + 'comments', newComment)
      .then((response) => {
        console.log('Comments data updated successfully.');
        fetchComments(); // 댓글 새로고침
        //scrolldivRef.current.scrollToEnd({ animated: true }); // 화면 최하단으로 스크롤 이동
      })
      .catch((error) => {
        console.error('Comments data could not be saved.' + error);
      });

    setComment(''); // 인풋창 초기화
  };

  const handleUpdateButtonClick = () => {
    swal({
      title: '수정 확인',
      text: '작성한 글을 수정하시겠습니까?',
      icon: 'warning',
      buttons: ['취소', '확인'],
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        handleUpdate();
      }
    });
  };

  const handleDeleteButtonClick = (url) => {
    swal({
      title: '삭제 확인',
      text: '정말 삭제하시겠습니까?',
      icon: 'warning',
      buttons: ['취소', '확인'],
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        removeData(url);
      }
    });
  };

  // '수정' 버튼 클릭 시 수정 페이지로 이동
  const handleUpdate = () => {
    navigate('/postCreate', {
      state: {
        boardName: boardName,
        post: post, // 현재 글 정보를 PostCreate 로 보낸다. 페이지 재활용을 위함.
      },
    });
  };

  // 데이터 삭제 요청
  const removeData = (url) => {
    axios
      .delete(serverPath + url)
      .then(() => {
        console.log('Data removed successfully.');
        if (url.includes('comments/')) {
          fetchComments(); // 댓글 삭제한 경우 댓글 목록을 새로고침
        } else if (url.includes('posts/')) {
          navigate('/boardScreen'); // 글 삭제한 경우 게시판 화면으로 돌아감
        }
      })
      .catch((error) => {
        console.error('Data could not be removed.' + error);
      });
  };

  // 글 삭제
  const handleDelete = () => {
    const url = 'posts/' + post.id;
    handleDeleteButtonClick(url);
  };

  // 댓글 삭제
  const handleCommentDelete = (id) => {
    const url = 'comments/' + id;
    handleDeleteButtonClick(url);
  };

  return (
    <Container>
      <ContentContainer>
        <Title>{boardDisplayName} 게시판</Title>
        <TitleArea>{post.title}</TitleArea>
        <TopUIContainer>
          <CreateInfo>
            <div style={{ fontSize: 15 }}>작성자: {userName}</div>
            <div style={{ fontSize: 15 }}>작성일: {postCreatingTime}</div>
          </CreateInfo>

          <ButtonContainer>
            {userEmail === post.userEmail ? (
              <>
                <StyledButton
                  shadowcolor="#7bb4e3"
                  backgroundcolor="#004EA2"
                  onClick={handleUpdateButtonClick}
                >
                  <div>수정</div>
                </StyledButton>
                <StyledButton
                  shadowcolor="#FA7CD7"
                  backgroundcolor="#DF243B"
                  onClick={handleDelete}
                >
                  <div>삭제</div>
                </StyledButton>
              </>
            ) : null}
          </ButtonContainer>
        </TopUIContainer>
        <PostBody>
          <div style={{ paddingLeft: '20px' }}>{parse(post.body)}</div>
        </PostBody>
      </ContentContainer>

      <Line />

      <InputRow>
        <CommentInput // 댓글 입력창
          placeholder={
            isLoggedIn ? '댓글 작성하기' : '로그인하고 댓글을 작성해보세요!'
          }
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          readOnly={!isLoggedIn}
        />
        <SubmitButton onClick={handleSubmit}>전송</SubmitButton>
      </InputRow>

      {commentList.length > 0 && <Line />}

      <BottomContainer>
        {commentList.length > 0 &&
          commentList.map((item, index) => (
            <Card key={index}>
              <div>
                <CommentRow>
                  <div style={{ width: '95%' }}>
                    <div style={{ fontSize: 12 }}>
                      {item.userEmail.split('@')[0]}
                    </div>
                    <div style={{ fontSize: 16 }}>{item.comment}</div>
                  </div>
                  {userEmail === item.userEmail ? (
                    <StyledButton
                      shadowcolor="#FA7CD7"
                      backgroundcolor="#DF243B"
                      onClick={() => handleCommentDelete(item.id)}
                    >
                      <div>삭제</div>
                    </StyledButton>
                  ) : null}
                </CommentRow>
              </div>
            </Card>
          ))}
      </BottomContainer>
    </Container>
  );
};

export default PostDetail;
