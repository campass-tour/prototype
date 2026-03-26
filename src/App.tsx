import React from 'react';
import { MessageCard } from './components/wall/MessageCard';

const messageData = {
  username: "小明",
  avatar: "https://i.pravatar.cc/150?u=xiaoming",
  text: "大家好，这是我的第一条留言！",
  timestamp: "1分钟前",
  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop"
};

function App() {
  return (
    <div style={{ padding: 40, background: '#f5f5f5', minHeight: '100vh' }}>
      <MessageCard data={messageData} />
    </div>
  );
}

export default App;