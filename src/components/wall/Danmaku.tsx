import { useState, useRef } from 'react';
import './Danmaku.css';
import MessageCard from './MessageCard';

export interface DanmakuProps {
  id: string;
  text: string;
  avatarUrl?: string; // the thumbnail on the right
  top: string;
  animationDuration: string;
  delay: string;
  userName: string;
  timestamp: string;
  imageUrl?: string;
  likes: number;
}

const Danmaku: React.FC<DanmakuProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (pillRef.current) {
      // Pause animation
      pillRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (pillRef.current) {
      // Resume animation
      pillRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <>
      <div 
        ref={pillRef}
        className="danmaku-pill"
        style={{ 
          top: props.top, 
          animationDuration: props.animationDuration,
          animationDelay: props.delay
        }}
        onClick={handleOpenModal}
      >
        <span className="danmaku-text">{props.text}</span>
        {props.avatarUrl && (
          <img className="danmaku-thumbnail" src={props.avatarUrl} alt="Thumbnail" />
        )}
      </div>

      {isModalOpen && (
        <div className="danmaku-modal-overlay" onClick={handleCloseModal}>
          <div className="danmaku-modal-content" onClick={(e) => e.stopPropagation()}>
            <MessageCard
              userName={props.userName}
              userAvatar={props.avatarUrl || ''}
              timestamp={props.timestamp}
              text={props.text}
              imageUrl={props.imageUrl}
              initialLikes={props.likes}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Danmaku;
