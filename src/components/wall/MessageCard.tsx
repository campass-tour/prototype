import React from 'react';

export interface MessageCardProps {
  data: {
    username: string;
    avatar: string;
    text: string;
    timestamp: string;
    imageUrl?: string;
  };
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    padding: '16px',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxWidth: '400px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  username: {
    fontWeight: 'bold',
    color: '#281559',
    margin: 0,
    fontSize: '14px',
  },
  bodyText: {
    color: '#333333', // Deep grey
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.5',
  },
  imageContainer: {
    marginTop: '4px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
  },
  footer: {
    fontSize: '12px',
    color: '#999999', // Light grey
    margin: 0,
    marginTop: '4px',
  },
};

export const MessageCard: React.FC<MessageCardProps> = ({ data }) => {
  return (
    <div style={styles.card}>
      {/* Top Section */}
      <div style={styles.header}>
        <img src={data.avatar} alt={`${data.username}'s avatar`} style={styles.avatar} />
        <h4 style={styles.username}>{data.username}</h4>
      </div>

      {/* Middle Section */}
      <p style={styles.bodyText}>{data.text}</p>

      {/* Optional Bottom Section */}
      {data.imageUrl && (
        <div style={styles.imageContainer}>
          <img src={data.imageUrl} alt="Attached content" style={styles.image} />
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        {data.timestamp}
      </div>
    </div>
  );
};
