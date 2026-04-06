import React, { useEffect, useRef, useState } from 'react';
import SettingsModal from './settingsModel';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helper, setHelper] = useState("Checking Credentials...");
  const [isConnecting, setIsConnecting] = useState(false);

  const credsRef = useRef({ user: "", pass: "" });

  const loadCredentials = () => {
    chrome.storage.local.get(['bit_username', 'bit_password', 'isAutoConnecting'], (res) => {
      if (res.bit_username && res.bit_password) {
        credsRef.current = { user: res.bit_username, pass: res.bit_password };
        setHelper(null);
      } else {
        setHelper("No credentials found. Please click Settings.");
      }
      setIsConnecting(!!res.isAutoConnecting);
    });
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const safeClick = (el) => {
    if (!el) return;
    const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  };

  const runAutomation = () => {
    const credentials = credsRef.current;

    const userField = document.querySelector('input[name="user_id"], input[name="usrname"]');
    const passField = document.querySelector('input[name="password"], input[name="newpasswd"]');
    const termsBox = document.querySelector('input[type="checkbox"]');

    const allBtns = Array.from(document.querySelectorAll('input[type="button"], button, input[type="submit"]'));
    const deleteBtn = allBtns.find(b => (b.value || "").includes("Delete"));
    const goToLoginBtn = allBtns.find(b => (b.value || "").includes("Go to Login"));
    const submitBtn = document.querySelector('input[type="submit"]');

    const isWelcomePage = document.body.innerText.includes("Welcome! You are logged in");
    const isAlreadyLoggedIn = document.body.innerText.includes("Already logged in.");
    const isLoginSuccessful = document.body.innerText.includes("Login successful.");
    const isTryAgain = document.body.innerText.includes("Incorrect User Name / Password.");

    if (isWelcomePage) {
      console.log("QuickConnect: Process Finished Successfully.");
      chrome.storage.local.set({ isAutoConnecting: false });
      return;
    }

    if (isAlreadyLoggedIn) {
      console.log("QuickConnect: Already logged in. Ending process.");
      chrome.storage.local.set({ isAutoConnecting: false })
      return;
    }

    if (isLoginSuccessful) {
      console.log("QuickConnect: Login successful. Ending process.");
      chrome.storage.local.set({ isAutoConnecting: false })
      return;
    }

    if (isTryAgain) {
      console.log("QuickConnect: Login failed. Incorrect User name/Password.");
      chrome.storage.local.set({ isAutoConnecting: false })
      setHelper("Credentials incorrect. Please update in Settings.");
      return;
    }

    if (goToLoginBtn) {
      console.log("QuickConnect: Returning to login...");
      goToLoginBtn.click();
      return;
    }

    if (deleteBtn) {
      console.log("QuickConnect: Exceeded limit. Initiating session delete...");
      deleteBtn.click();
      return;
    }

    if (userField && passField) {
      userField.value = credentials.user;
      passField.value = credentials.pass;

      if (termsBox) {
        console.log("QuickConnect: Final login step...");
        termsBox.checked = true;
      } else {
        console.log("QuickConnect: Verifying credentials for logout...");
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.click();
        } else {
          document.forms[0]?.submit();
        }
      }, 300);
    }
  };

const handleConnect = () => {
  chrome.storage.local.set({ isAutoConnecting: true }, () => {
    setIsConnecting(true);
    runAutomation();
  });
};

const handleStop = () => {
  chrome.storage.local.set({ isAutoConnecting: false }, () => {
    setIsConnecting(false);
    console.log("QuickConnect: Automation stopped by user.");
  });
};

useEffect(() => {
  chrome.storage.local.get(['isAutoConnecting'], (res) => {
    if (res.isAutoConnecting) {
      const timer = setTimeout(runAutomation, 800);
      return () => clearTimeout(timer);
    }
  });
}, []);

// --- MODERN PLEASANT UI STYLES ---
const styles = {
  container: {
    backgroundColor: '#1e293b', // Soft Slate Blue (Easy on eyes)
    color: '#f8fafc',
    padding: '16px 20px',
    marginBottom: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    border: '1px solid #334155', // Subtle border
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: '32px',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#f8fafc', // Crisp white for contrast
    letterSpacing: '0.3px'
  },
  icon: {
    color: '#60a5fa' // Soft Azure Blue
  },
  settingsBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background 0.2s ease'
  },
  button: {
    backgroundColor: '#3b82f6', // Vibrant modern blue
    color: '#ffffff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)', // Nice blue glow
    transition: 'transform 0.1s ease',
    width: '100%',
    justifyContent: 'center'
  },
  helperText: {
    color: '#fbbf24', // Pleasant Amber instead of harsh Red
    fontSize: '12px',
    margin: "0",
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: '6px 12px',
    borderRadius: '6px',
    width: '100%',
    boxSizing: 'border-box'
  },
  stopButton: {
    backgroundColor: '#ef4444', // Pleasant modern Red
    color: '#ffffff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
    width: '100%',
    justifyContent: 'center'
  }
};

return (
  <div style={styles.container}>
    <div style={styles.header}>
      <div style={styles.titleGroup}>
        <svg style={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        <span style={styles.title}>QuickConnect</span>
      </div>
      <button onClick={() => setIsModalOpen(true)} style={styles.settingsBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Settings
      </button>
    </div>

    {helper && <p style={styles.helperText}>{helper}</p>}

    {!isConnecting ? (
      <button
        disabled={!!helper}
        onClick={handleConnect}
        style={{ ...styles.button, opacity: helper ? 0.5 : 1, cursor: helper ? 'not-allowed' : 'pointer' }}
      >
        <span>Connect</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </button>
    ) : (
      <button
        onClick={handleStop}
        style={styles.stopButton}
      >
        <span>Stop Automation</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="12" height="12" fill="currentColor" />
        </svg>
      </button>
    )}

    <SettingsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSave={(u, p) => {
        loadCredentials();
      }}
    />
  </div>
);
}

export default App;