import moment from "moment";
import { useEffect, useState } from "react";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/user/${comment.userId}`
        );
        const data = await res.json();

        if (data.success === true) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture?.url}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
