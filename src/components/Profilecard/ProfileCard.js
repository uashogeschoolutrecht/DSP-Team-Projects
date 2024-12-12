import React from 'react';
import styles from './styles.module.css';

const ProfileCard = ({ name, title, avatarUrl }) => {
  return (
    <div className={styles['member-card']}>
      <img src={avatarUrl} alt={`${name}'s profile`} className={styles.avatar} />
      <div className={styles['member-name']}>{name}</div>
      <div className={styles.username}>{title}</div>
    </div>
  );
};

export default ProfileCard;
