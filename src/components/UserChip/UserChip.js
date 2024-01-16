import React from 'react';
import './UserChip.css';

const UserChip = ({ user, onRemove, isHighlighted }) => {
  const chipClass = isHighlighted ? 'chip highlighted' : 'chip';

  return (
    <div className={chipClass}>
      {/* If user has an avatar, display it */}
      {user.avatarUrl && <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="chip-image" />}
      <span className="chip-name">{user.name}</span>
      <button onClick={() => onRemove(user.id)} className="chip-remove-btn">×</button>
    </div>
  );
};

export default UserChip;
