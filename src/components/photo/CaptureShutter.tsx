import React, { useState } from 'react';

export interface CaptureShutterProps {
  onCapture?: () => void;
  disabled?: boolean;
  label?: string;
  absolute?: boolean;
  bottom?: number;
}

const tokens = {
  color: {
    primary: '#281559',
    background: '#F5F6FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    subText: '#888888',
    disabled: '#E0E0E0',
    disabledText: '#9C9C9C',
    accent: '#00C4CC',
    successFlash: 'rgba(0, 196, 204, 0.28)',
  },
  shadow: {
    soft: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    floating: '0px 10px 24px rgba(0, 0, 0, 0.14)',
  },
  radius: {
    pill: '100px',
  },
};

const styles = {
  wrapper: (absolute: boolean, bottom: number): React.CSSProperties => ({
    position: absolute ? 'absolute' : 'relative',
    left: absolute ? '50%' : undefined,
    bottom: absolute ? `${bottom}px` : undefined,
    transform: absolute ? 'translateX(-50%)' : 'none',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: absolute ? 0 : '24px',
    boxSizing: 'border-box',
  }),

  label: (disabled: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: tokens.radius.pill,
    backgroundColor: '#FFFFFF',
    color: disabled ? tokens.color.disabledText : tokens.color.text,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.2,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
    boxShadow: tokens.shadow.soft,
    textAlign: 'center',
  }),

  button: (disabled: boolean, pressed: boolean): React.CSSProperties => ({
    position: 'relative',
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    border: 'none',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.85 : 1,
    boxShadow: pressed
      ? '0px 4px 10px rgba(0, 0, 0, 0.10)'
      : tokens.shadow.floating,
    transform: pressed ? 'scale(0.96)' : 'scale(1)',
    transition: 'all 0.18s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }),

  outerRing: (disabled: boolean, flash: boolean): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: `4px solid ${
      disabled
        ? tokens.color.disabled
        : flash
        ? tokens.color.accent
        : tokens.color.primary
    }`,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.18s ease',
    zIndex: 2,
  }),

  innerCircle: (disabled: boolean, flash: boolean): React.CSSProperties => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: disabled
      ? '#F0F0F0'
      : flash
      ? 'rgba(0, 196, 204, 0.12)'
      : '#F7F7FB',
    transition: 'all 0.18s ease',
  }),

  flashOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    backgroundColor: tokens.color.successFlash,
    pointerEvents: 'none',
    zIndex: 1,
    animation: 'captureFlashFade 0.3s ease',
  } as React.CSSProperties,

  helperText: {
    fontSize: '12px',
    color: '#888888',
    fontWeight: 400,
    fontFamily: 'Inter, "Microsoft YaHei", sans-serif',
    textAlign: 'center' as const,
    lineHeight: 1.4,
  },

  keyframes: `
    @keyframes captureFlashFade {
      0% {
        opacity: 0.9;
        transform: scale(0.92);
      }
      50% {
        opacity: 0.45;
        transform: scale(1.04);
      }
      100% {
        opacity: 0;
        transform: scale(1.12);
      }
    }
  `,
};

const CaptureShutter: React.FC<CaptureShutterProps> = ({
  onCapture,
  disabled = false,
  label = 'Tap to capture',
  absolute = false,
  bottom = 24,
}) => {
  const [pressed, setPressed] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setFlash(true);

    setTimeout(() => {
      setFlash(false);
    }, 300);

    if (onCapture) {
      onCapture();
    }
  };

  return (
    <>
      <style>{styles.keyframes}</style>

      <div style={styles.wrapper(absolute, bottom)}>
        <div style={styles.label(disabled)}>
          {disabled ? 'Unavailable now' : label}
        </div>

        <button
          type="button"
          aria-label="Capture shutter"
          style={styles.button(disabled, pressed)}
          disabled={disabled}
          onMouseDown={() => {
            if (!disabled) setPressed(true);
          }}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onClick={handleClick}
        >
          {flash && <div style={styles.flashOverlay} />}

          <div style={styles.outerRing(disabled, flash)}>
            <div style={styles.innerCircle(disabled, flash)} />
          </div>
        </button>

        <div style={styles.helperText}>
          {disabled ? 'Select an active spot first' : 'Camera shutter button'}
        </div>
      </div>
    </>
  );
};

export default CaptureShutter;
