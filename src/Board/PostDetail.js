import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 60%;
  min-width: 30em;
  background-color: #bbd2ec;
  top: 5em;
  left: 20%;
  position: absolute;
  backgroundcolor: #bbd2ec;
`;

const Content = styled.div`
  flex: 1;
  padding: 10px;
`;

const IdRow = styled.div`
  flexdirection: row;
  justifycontent: space-between;
  alignitems: center;
  padding: 5px;
`;

const CommentRow = styled.div`
  flexdirection: row;
  justifycontent: space-between;
  alignitems: center;
`;

const ButtonRow = styled.div`
  flexdirection: row;
  justifycontent: flex-end;
  alignitems: center;
  marginbottom: 10px;
`;

const Title = styled.div`
  fontsize: 24px;
  fontweight: bold;
  marginbottom: 10px;
  padding: 5px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  borderradius: 5px;
`;

const Buttondiv = styled.div`
  color: white;
`;

const Contentdiv = styled.div`
  padding: 10px;
  fontsize: 16px;
  backgroundcolor: #dfe9f5;
  minheight: 405px;
  borderradius: 20px;
`;

const WriteButton = styled.button`
  width: 50px;
  justifycontent: center;
  alignitems: center;
  position: relative;
  backgroundcolor: #e6e6fa;
  bordercolor: #4b3e9a;
  borderwidth: 1px;
  borderradius: 5px;
  margintop: 30px;
`;

const InputRow = styled.div`
  flexdirection: row;
  justifycontent: space-between;
  padding: 10px;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 40px;
  bordercolor: gray;
  borderwidth: 1px;
  borderradius: 5px;
  marginright: 5px;
  margintop: 30px;
`;

const CommentDeleteButton = styled.button`
  padding: 10px;
  borderradius: 5px;
  backgroundcolor: #df243b;
`;

const Card = styled.div`
  margin: 5px;
  minheight: 50px;
`;

const Carddiv = styled.div`
  fontsize: 20px;
`;

const Line = styled.div`
  borderbottomcolor: #7bb4e3;
  borderbottomwidth: 10px;
  margin: 10px;
  borderradius: 5px;
`;
// 게시판 글 클릭했을 때 내용 보이는 화면
const PostDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardName, post } = location.state;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [userName, setUserName] = useState();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userEmail = useSelector((state) => state.userEmail);
  const serverPath = 'http://192.168.0.3:8080/';

  console.log('boardName: ' + boardName);

  useEffect(() => {
    if (userEmail) {
      setUserName(userEmail.split('@')[0]);
    }
  }, [userEmail]);

  // 댓글 가져오기
  const fetchComments = () => {
    axios
      .get(serverPath + 'comments', { params: { postId: post.id } })
      .then((response) => {
        const data = response.data;
        if (data) {
          const comments = Object.keys(data).map((key) => ({
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

  //const scrolldivRef = useRef();

  const handleSubmit = () => {
    // 댓글 저장
    if (comment.trim() === '') {
      // 댓글 내용이 없으면 저장하지 않음
      return;
    }
    const commentId = userName + '_' + Date.now();

    // post와 post.id가 존재하는지 확인
    if (!post || !post.id) {
      console.error('Post or post.id is undefined.');
      return;
    }

    const newComment = {
      commentId: commentId,
      userEmail: userEmail,
      comment: comment,
      postId: post.id,
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
      })
      .catch((error) => {
        console.error('Data could not be removed.' + error);
      });
  };

  // 삭제 확인 창
  const removeProcess = (url) => {
    const userConfirmed = window.confirm(
      '삭제 확인',
      '정말로 삭제하시겠습니까?'
    );
    if (userConfirmed) {
      removeData(url);
    }
  };

  // 글 삭제
  const handleDelete = () => {
    console.log('id = ' + post.postId);
    const url = 'posts/' + post.postId;
    removeProcess(url);
  };

  // 댓글 삭제
  const handleCommentDelete = (commentId) => {
    const url = 'comments/' + commentId;
    removeProcess(url);
    fetchComments(); // 삭제 후 댓글을 다시 불러옴
  };

  return (
    <Container>
      <Content>
        <Title>{post.title}</Title>
        <IdRow>
          <div style={{ fontSize: 15 }}>
            작성자: {post ? post.userEmail.split('_')[0] : ''}
          </div>

          <ButtonRow>
            {userEmail === post.userEmail ? (
              <>
                <Button
                  style={{ backgroundColor: '#004EA2' }}
                  onClick={handleUpdate}
                >
                  <div>수정</div>
                </Button>
                <Button
                  style={{ backgroundColor: '#DF243B' }}
                  onClick={handleDelete}
                >
                  <div>삭제</div>
                </Button>
              </>
            ) : null}
          </ButtonRow>
        </IdRow>
        <div>{post.body}</div>
      </Content>

      {commentList.length > 0 && <Line />}

      {commentList.length > 0 &&
        commentList.map((item, index) => (
          <Card key={index}>
            <div>
              <CommentRow>
                <div>
                  <div style={{ fontSize: 12 }}>
                    {item.userEmail.split('@')[0]}
                  </div>
                  <div style={{ fontSize: 16 }}>{item.comment}</div>
                </div>
                {userEmail === item.userEmail ? (
                  <CommentDeleteButton
                    onClick={() => handleCommentDelete(item.commentId)}
                  >
                    <div>삭제</div>
                  </CommentDeleteButton>
                ) : null}
              </CommentRow>
            </div>
          </Card>
        ))}

      {commentList.length > 0 && <Line />}

      <InputRow>
        <CommentInput // 댓글 입력창
          placeholder={
            isLoggedIn ? '댓글 작성하기' : '로그인하고 댓글을 작성해보세요!'
          }
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          readOnly={!isLoggedIn}
        />
        <WriteButton onClick={handleSubmit}>
          전송
          {/* <Icon name="comment" size={24} color="#35439c" /> */}
        </WriteButton>
      </InputRow>
    </Container>
  );
};

export default PostDetail;
