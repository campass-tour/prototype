import React from 'react';

export interface ARContainerProps {
  children?: React.ReactNode;
  backgroundImage?: string;
  height?: string | number;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  fullScreen?: boolean;
}

const tokens = {
  color: {
    primary: '#281559',
    background: '#F5F6FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    subText: '#888888',
    accent: '#00C4CC',
  },
  radius: {
    card: '16px',
    pill: '100px',
  },
  shadow: {
    soft: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    floating: '0px 10px 30px rgba(0, 0, 0, 0.12)',
  },
};

const styles = {
  wrapper: (
    height: string | number,
    backgroundImage?: string,
    fullScreen?: boolean
  ): React.CSSProperties => ({
    position: 'relative',
    width: '100%',
    height,
    minHeight: fullScreen ? '100vh' : '560px',
    overflow: 'hidden',
    borderRadius: tokens.radius.card,
    backgroundColor: tokens.color.background,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: tokens.shadow.soft,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
  }),

  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(245,246,250,0.10) 0%, rgba(245,246,250,0.00) 20%, rgba(0,0,0,0.08) 72%, rgba(0,0,0,0.16) 100%)',
    pointerEvents: 'none',
  } as React.CSSProperties,

  vignette: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.12) 100%)',
    pointerEvents: 'none',
  } as React.CSSProperties,

  header: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    right: '16px',
    zIndex: 3,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  } as React.CSSProperties,

  headerCard: {
    maxWidth: '90%',
    padding: '10px 16px',
    borderRadius: tokens.radius.card,
    backgroundColor: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(10px)',
    boxShadow: tokens.shadow.soft,
    textAlign: 'center' as const,
  },

  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: tokens.color.text,
    lineHeight: 1.3,
  } as React.CSSProperties,

  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    fontWeight: 400,
    color: tokens.color.subText,
    lineHeight: 1.4,
  } as React.CSSProperties,

  childrenLayer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    boxSizing: 'border-box',
  } as React.CSSProperties,
};

const ARContainer: React.FC<ARContainerProps> = ({
  children,
  backgroundImage,
  height = '560px',
  title = 'AR Discovery',
  subtitle = 'Move your phone and tap an active pin',
  showHeader = true,
  fullScreen = false,
}) => {
  return (
    <div style={styles.wrapper(height, backgroundImage, fullScreen)}>
      <div style={styles.backgroundLayer} />
      <div style={styles.vignette} />

      {showHeader && (
        <div style={styles.header}>
          <div style={styles.headerCard}>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.subtitle}>{subtitle}</p>
          </div>
        </div>
      )}

      <div style={styles.childrenLayer}>{children}</div>
    </div>
  );
};

export default ARContainer;
