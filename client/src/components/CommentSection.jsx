import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [commentError, setCommentError] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/v1/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          userId: currentUser._id,
          postId,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if (data.success === true) {
        setComment("");
        setCommentError(null);
        setComments((prevComments) => [
          ...prevComments,
          {
            ...data.newComment,
            userId: currentUser._id,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/comment/getPostComment/${postId}`
        );
        const data = await res.json();
        if (data.success === true) {
          setComments(data.comments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-base">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture.url}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-sm text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-base text-teal-500 my-5 flex gap-1">
          You must be login to comment.
          <Link
            className="text-blue-600 dark:text-blue-500 hover:underline"
            to={"/login"}
          >
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="resize-none"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-lg">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
