// UserAvatar: displays a user's avatar or their initials when no image is available.
// Note: the filename is `UserAvater.jsx` — keep this name unless you want to rename the file.
const UserAvatar = ({ user, size = "w-8 h-8" }) => {
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className={`${size} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
};

export default UserAvatar;
