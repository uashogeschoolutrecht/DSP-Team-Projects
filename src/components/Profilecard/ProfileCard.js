import React from 'react';
import styles from './styles.module.css';

const ProfileCard = ({ name, title, avatarUrl }) => {
  const baseUrl = process.env.PUBLIC_URL || ''; // Use PUBLIC_URL for proper asset resolution

  return (
    <div className={styles['member-card']}>
      <img 
        src={`${baseUrl}${avatarUrl}`} // Prepend PUBLIC_URL to avatarUrl
        alt={`${name}'s profile`} 
        className={styles.avatar} 
      />
      <div className={styles['member-name']}>{name}</div>
      <div className={styles.username}>{title}</div>
    </div>
  );
};

export default ProfileCard;
