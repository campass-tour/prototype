import { useState } from 'react';
import './MessageCard.css';

export interface MessageCardProps {
  userName: string;
  userAvatar: string;
  timestamp: string;
  text: string;
  imageUrl?: string;
  initialLikes?: number;
  onClose?: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  userName,
  userAvatar,
  timestamp,
  text,
  imageUrl,
  initialLikes = 0,
  onClose
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes + 1 : likes - 1);
  };

  return (
    <>
      <div className="message-card">
        {/* Header */}
        <div className="mc-header">
          <div className="mc-user-info">
            {userAvatar && <img className="mc-avatar" src={userAvatar} alt={userName} />}
            <span className="mc-username">{userName}</span>
          </div>
          <div className="mc-header-right">
            <span className="mc-timestamp">{timestamp}</span>
            {onClose && (
              <button className="mc-close-btn" onClick={onClose} aria-label="Close">
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Content text */}
        <div className="mc-text">{text}</div>

        {/* Thumbnail / Image */}
        {imageUrl && (
          <div className="mc-image-container" onClick={() => setIsLightboxOpen(true)}>
            <img src={imageUrl} className="mc-image" alt="Attachment" />
          </div>
        )}

        {/* Footer / Interaction */}
        <div className="mc-footer">
          <div className="mc-spacer"></div>
          <button className={`mc-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <span className="mc-heart">❤️</span>
            <span className="mc-like-count">{likes}</span>
          </button>
        </div>
      </div>

      {/* Lightbox for Image */}
      {isLightboxOpen && imageUrl && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <img 
            className="lightbox-image" 
            src={imageUrl} 
            alt="Expanded Attachment" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};

export default MessageCard;

