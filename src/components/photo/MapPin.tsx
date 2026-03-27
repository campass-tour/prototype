import React from 'react';

export type PinStatus = 'locked' | 'available' | 'captured';

export interface MapPinProps {
  title: string;
  subtitle?: string;
  status?: PinStatus;
  selected?: boolean;
  onClick?: () => void;

  // 可选：只有你以后想把它放到 AR 画面里时再用
  x?: string;
  y?: string;
  absolute?: boolean;
}

const tokens = {
  color: {
    primary: '#281559',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    subText: '#888888',
    accent: '#00C4CC',
    locked: '#E0E0E0',
    lockedText: '#9C9C9C',
    background: '#F5F6FA',
  },
  shadow: {
    soft: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    floating: '0px 8px 20px rgba(0, 0, 0, 0.12)',
  },
};

const getStatusColor = (status: PinStatus) => {
  if (status === 'locked') return tokens.color.locked;
  if (status === 'captured') return tokens.color.accent;
  return tokens.color.primary;
};

const getStatusText = (status: PinStatus) => {
  if (status === 'locked') return 'Locked';
  if (status === 'captured') return 'Captured';
  return 'AR Spot';
};

const getCenterIcon = (status: PinStatus) => {
  if (status === 'locked') return '🔒';
  if (status === 'captured') return '✓';
  return 'AR';
};

const styles = {
  wrapper: (
    absolute: boolean,
    x?: string,
    y?: string
  ): React.CSSProperties => ({
    position: absolute ? 'absolute' : 'relative',
    left: absolute ? x : undefined,
    top: absolute ? y : undefined,
    transform: absolute ? 'translate(-50%, -100%)' : 'none',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    padding: absolute ? 0 : '24px',
    boxSizing: 'border-box',
  }),

  card: (selected: boolean): React.CSSProperties => ({
    marginBottom: '10px',
    minWidth: '140px',
    maxWidth: '200px',
    padding: '10px 12px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255,255,255,0.96)',
    boxShadow: selected
      ? '0px 10px 24px rgba(40, 21, 89, 0.18)'
      : tokens.shadow.soft,
    border: selected
      ? '1px solid rgba(40, 21, 89, 0.16)'
      : '1px solid rgba(0,0,0,0.04)',
    textAlign: 'center',
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
  }),

  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.color.text,
    lineHeight: 1.3,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
  } as React.CSSProperties,

  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    fontWeight: 400,
    color: tokens.color.subText,
    lineHeight: 1.4,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
  } as React.CSSProperties,

  badge: (status: PinStatus): React.CSSProperties => ({
    marginTop: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 10px',
    borderRadius: '100px',
    backgroundColor:
      status === 'locked'
        ? '#F2F2F2'
        : status === 'captured'
        ? 'rgba(0,196,204,0.12)'
        : 'rgba(40,21,89,0.10)',
    color:
      status === 'locked'
        ? tokens.color.lockedText
        : status === 'captured'
        ? tokens.color.accent
        : tokens.color.primary,
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
  }),

  pinWrap: (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transform: selected ? 'scale(1.06)' : 'scale(1)',
    transition: 'transform 0.2s ease',
  }),

  pinHead: (status: PinStatus, selected: boolean): React.CSSProperties => ({
    width: selected ? '52px' : '48px',
    height: selected ? '52px' : '48px',
    borderRadius: '50%',
    backgroundColor: getStatusColor(status),
    color: status === 'locked' ? tokens.color.lockedText : '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
    boxShadow: tokens.shadow.floating,
    transition: 'all 0.2s ease',
  }),

  pinInner: (status: PinStatus): React.CSSProperties => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor:
      status === 'locked'
        ? 'rgba(255,255,255,0.72)'
        : 'rgba(255,255,255,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
  }),

  pinTail: (status: PinStatus): React.CSSProperties => ({
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: `15px solid ${getStatusColor(status)}`,
    marginTop: '-2px',
    filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.12))',
  }),
};

const MapPin: React.FC<MapPinProps> = ({
  title,
  subtitle,
  status = 'available',
  selected = false,
  onClick,
  x,
  y,
  absolute = false,
}) => {
  return (
    <div style={styles.wrapper(absolute, x, y)} onClick={onClick}>
      <div style={styles.card(selected)}>
        <h3 style={styles.title}>{title}</h3>
        {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
        <div style={styles.badge(status)}>{getStatusText(status)}</div>
      </div>

      <div style={styles.pinWrap(selected)}>
        <div style={styles.pinHead(status, selected)}>
          <div style={styles.pinInner(status)}>{getCenterIcon(status)}</div>
        </div>
        <div style={styles.pinTail(status)} />
      </div>
    </div>
  );
};

export default MapPin;
