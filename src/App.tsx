import MessageCard from './components/wall/MessageCard';
import Danmaku from './components/wall/Danmaku';

const sampleUserData = {
  userName: "小明",
  userAvatar: "https://i.pravatar.cc/150?u=xiaoming",
  text: "这是一条测试弹幕！超长的话就会被截断哦这是超出截断截断截断...",
  timestamp: "2小时前",
  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
  likes: 42
};

function App() {
  return (
    <div style={{ padding: 40, background: 'var(--color-primary)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Danmaku & MessageCard Test</h1>
      
      {/* Sample Danmaku */}
      <Danmaku 
        id="1"
        text={sampleUserData.text}
        avatarUrl={sampleUserData.userAvatar}
        top="20%"
        animationDuration="10s"
        delay="0s"
        userName={sampleUserData.userName}
        timestamp={sampleUserData.timestamp}
        imageUrl={sampleUserData.imageUrl}
        likes={sampleUserData.likes}
      />
      <Danmaku 
        id="2"
        text="欢迎来到这面墙～"
        avatarUrl="https://i.pravatar.cc/150?u=xiaoqiang"
        top="40%"
        animationDuration="15s"
        delay="1s"
        userName="小强"
        timestamp="已发布 5天前"
        likes={120}
      />
      <Danmaku 
        id="3"
        text="只有文字的弹幕！没有任何其他的东西。也可以点击哦。"
        top="60%"
        animationDuration="12s"
        delay="3s"
        userName="匿名用户"
        timestamp="刚刚"
        likes={0}
      />
      
      {/* Centered raw message card for previewing static view */}
      <div style={{ marginTop: '100px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ color: 'white' }}>Standalone Message Card</h2>
        <MessageCard 
          userName={sampleUserData.userName}
          userAvatar={sampleUserData.userAvatar}
          timestamp={sampleUserData.timestamp}
          text={sampleUserData.text}
          imageUrl={sampleUserData.imageUrl}
          initialLikes={sampleUserData.likes}
        />
      </div>
    </div>
  );
}

export default App;