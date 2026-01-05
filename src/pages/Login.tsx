import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon components
const EmailIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <rect width="20" height="20" rx="10" fill="#6c63ff" />
    <path
      d="M5.833 7.5l4.167 3.333L14.167 7.5"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3.75" y="6.25" width="12.5" height="7.5" rx="2" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <rect width="20" height="20" rx="10" fill="#6c63ff" />
    <rect x="6.25" y="9.167" width="7.5" height="4.583" rx="2" stroke="#fff" strokeWidth="1.5" />
    <path d="M10 12.083v.834" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M7.917 9.167V8.333a2.083 2.083 0 1 1 4.166 0v.834"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path
      d="M16.7 14.3c-.2.5-.5 1.1-.8 1.6-.5.7-1.1 1.5-1.9 1.5-.7 0-.9-.5-1.9-.5s-1.2.5-1.9.5c-.8 0-1.4-.7-1.9-1.5-.7-1.1-1.3-3.1-.5-4.4.5-.8 1.3-1.3 2.1-1.3.7 0 1.1.5 1.9.5s1.1-.5 1.9-.5c.7 0 1.5.5 2.1 1.3.2.3.3.6.4 1-.1 0-.2-.1-.3-.1-.5 0-.9.4-.9.9 0 .4.3.7.7.8zM13.2 6.2c.3-.4.5-.9.5-1.4 0-.1 0-.2-.1-.2-.5 0-1.1.3-1.4.7-.3.3-.5.8-.5 1.3 0 .1 0 .2.1.2.5 0 1.1-.3 1.4-.6z"
      fill="#222852"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <g clipPath="url(#a)">
      <path
        d="M19.6 10.2c0-.7-.1-1.3-.2-1.9H10v3.6h5.4c-.2 1.1-.9 2-1.8 2.6v2.1h2.9c1.7-1.6 2.7-4 2.7-6.4z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.4 0 4.4-.8 5.9-2.1l-2.9-2.1c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.6-4.9-3.7H2.1v2.3C3.6 18.3 6.6 20 10 20z"
        fill="#34A853"
      />
      <path
        d="M5.1 12.9c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V7.4H2.1A9.9 9.9 0 0 0 0 10c0 1.6.4 3.1 1.1 4.4l3.1-2.3z"
        fill="#FBBC05"
      />
      <path
        d="M10 4c1.3 0 2.5.4 3.4 1.2l2.5-2.5C14.4 1.1 12.4 0 10 0 6.6 0 3.6 1.7 2.1 4.4l3.1 2.3C5.8 5.6 7.7 4 10 4z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [providerMsg, setProviderMsg] = useState('');
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate('/dashboard');
  }

  const bgSrc =
    (window.devicePixelRatio > 1 && window.matchMedia('(min-resolution: 192dpi)').matches
      ? '/NetWorth Pro Login v2@2x.png'
      : null) || '/NetWorth Pro Login v2.png';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}
    >
      {/* Sharp background image, no blur */}
      <img
        src={bgSrc}
        alt="NetWorth Pro login background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />

      <div
        className="login-container"
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          zIndex: 2,
        }}
      >
        {/* Absolutely positioned login card for desktop */}
        <div
          className="login-card-outer"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            width: '100%',
            maxWidth: 480,
            minWidth: 320,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            className="login-right"
            style={{
              width: '100%',
              maxWidth: 400,
              minWidth: 0,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              padding: '2.5rem 2rem',
              boxShadow: '0 2px 16px #0002',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              position: 'relative',
            }}
          >
            <form className="login-form" style={{ width: '100%' }} onSubmit={handleLogin}>
              <div className="login-field" style={{ marginBottom: '1.2rem', position: 'relative' }}>
                <label
                  htmlFor="email"
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#fff',
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  Email
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: 8,
                    padding: '0.5rem 0.8rem',
                  }}
                >
                  <EmailIcon />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      padding: '0.7rem 0.5rem',
                      outline: 'none',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              <div className="login-field" style={{ marginBottom: '1.2rem', position: 'relative' }}>
                <label
                  htmlFor="password"
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#fff',
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  Password
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: 8,
                    padding: '0.5rem 0.8rem',
                  }}
                >
                  <LockIcon />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      padding: '0.7rem 0.5rem',
                      outline: 'none',
                      flex: 1,
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Show password"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6c63ff',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      marginLeft: '0.5rem',
                    }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div
                className="login-options"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.2rem',
                  fontSize: '0.95rem',
                }}
              >
                <label className="login-checkbox" style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" style={{ accentColor: '#6c63ff', marginRight: '0.4em' }} /> Keep
                  me logged in
                </label>
                <a href="#" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(90deg, #6c63ff 60%, #554ee2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.9rem 0',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.2s',
                  boxShadow: '0 2px 8px #6c63ff22',
                }}
              >
                Log In
              </button>

              <div
                className="login-or"
                style={{
                  textAlign: 'center',
                  margin: '0.7rem 0 1rem 0',
                  color: '#888',
                  fontSize: '0.95rem',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    background: '#fff',
                    padding: '0 1rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  or
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    borderTop: '1px solid #e0e0e0',
                    zIndex: 0,
                  }}
                />
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  background: '#f5f5f5',
                  color: '#222852',
                  border: '1px solid #e0e7ef',
                  borderRadius: 8,
                  padding: '0.7rem 0',
                  fontSize: '1rem',
                  marginBottom: '0.7rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
                onClick={() => setProviderMsg('Apple sign-in coming soon.')}
              >
                <AppleIcon /> Continue with Apple
              </button>

              <button
                type="button"
                style={{
                  width: '100%',
                  background: '#f5f5f5',
                  color: '#222852',
                  border: '1px solid #e0e7ef',
                  borderRadius: 8,
                  padding: '0.7rem 0',
                  fontSize: '1rem',
                  marginBottom: '0.7rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
                onClick={() => setProviderMsg('Google sign-in coming soon.')}
              >
                <GoogleIcon /> Continue with Google
              </button>

              {providerMsg && (
                <div
                  style={{
                    color: '#6c63ff',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: 8,
                    padding: '0.7rem 1rem',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  {providerMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
