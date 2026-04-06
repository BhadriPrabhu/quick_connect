import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      chrome.storage.local.get(['bit_username', 'bit_password'], (res) => {
        setUsername(res.bit_username || '');
        setPassword(res.bit_password || '');
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    chrome.storage.local.set({
      bit_username: username,
      bit_password: password
    }, () => {
      onSave(username, password);
      onClose(); 
    });
  };

  if (!isOpen) return null;

  // --- MODERN PLEASANT UI STYLES ---
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', // Deeper overlay
      backdropFilter: 'blur(4px)', // Modern frosted glass effect
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modal: {
      backgroundColor: '#1e293b', // Matches main app
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #334155',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      width: '320px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#f8fafc',
    },
    header: {
      margin: '0 0 20px 0',
      fontSize: '16px',
      fontWeight: '800',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerIcon: {
      color: '#60a5fa'
    },
    inputGroup: {
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#94a3b8',
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155',
      backgroundColor: '#0f172a', // Darker inset for inputs
      color: '#f8fafc',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // Aligned to the right
      gap: '12px',
      marginTop: '28px',
    },
    btnCancel: {
      padding: '10px 20px',
      backgroundColor: '#334155', // Nice slate grey
      color: '#f8fafc',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      transition: 'background 0.2s',
    },
    btnSave: {
      padding: '10px 24px',
      backgroundColor: '#3b82f6', // Vibrant modern blue
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '13px',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.header}>
          <svg style={styles.headerIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Configure Credentials
        </h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>BIT Email</label>
          <input 
            type="text" 
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="email@bitsathy.ac.in"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Wi-Fi Password</label>
          <input 
            type="password" 
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.btnCancel}>Cancel</button>
          <button onClick={handleSave} style={styles.btnSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;