import React, { useEffect } from 'react';

function App() {
  const credentials = {
    user: "bhadriprabhuk.ei24@bitsathy.ac.in",
    pass: "bhadri"
  };

  const runAutomation = () => {
    // 1. SELECTORS (Catching all BIT variations)
    const userField = document.querySelector('input[name="user_id"], input[name="usrname"]');
    const passField = document.querySelector('input[name="password"], input[name="newpasswd"]');
    const termsBox = document.querySelector('input[type="checkbox"]');
    
    const allBtns = Array.from(document.querySelectorAll('input[type="button"], button, input[type="submit"]'));
    const deleteBtn = allBtns.find(b => (b.value || "").includes("Delete"));
    const goToLoginBtn = allBtns.find(b => (b.value || "").includes("Go to Login"));
    const submitBtn = document.querySelector('input[type="submit"]');

    const isWelcomePage = document.body.innerText.includes("Welcome! You are logged in");

    // 2. STATE MACHINE LOGIC

    // SUCCESS STAGE
    if (isWelcomePage) {
      console.log("QuickConnect: Process Finished Successfully.");
      chrome.storage.local.set({ isAutoConnecting: false });
      return;
    }

    // REDIRECT STAGES
    if (goToLoginBtn) {
      console.log("QuickConnect: Returning to login...");
      goToLoginBtn.click(); // Standard DOM click, completely CSP safe
      return;
    }

    if (deleteBtn) {
      console.log("QuickConnect: Exceeded limit. Initiating session delete...");
      deleteBtn.click(); // Standard DOM click, completely CSP safe
      return;
    }

    // CREDENTIAL STAGES
    if (userField && passField) {
      userField.value = credentials.user;
      passField.value = credentials.pass;

      if (termsBox) {
        // --- FINAL LOGIN PAGE ---
        console.log("QuickConnect: Final login step...");
        termsBox.checked = true;
        // Turn off the loop right before the final submission
        // chrome.storage.local.set({ isAutoConnecting: false });
      } else {
        // --- LOGOUT VERIFICATION PAGE ---
        console.log("QuickConnect: Verifying credentials for logout...");
      }

      // Allow a brief moment for the values to register before submitting
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.click();
        } else {
          // Absolute fallback if the submit button is hidden: submit the form directly
          document.forms[0]?.submit();
        }
      }, 300);
    }
  };

  const handleConnect = () => {
    chrome.storage.local.set({ isAutoConnecting: true }, () => runAutomation());
  };

  useEffect(() => {
    chrome.storage.local.get(['isAutoConnecting'], (res) => {
      if (res.isAutoConnecting) {
        // 800ms delay to let the BIT portal finish its own internal loading
        const timer = setTimeout(runAutomation, 800);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  const styles = {
    container: { backgroundColor: '#0f172a', color: '#f8fafc', padding: '15px', marginBottom: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '2px solid #38bdf8', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.4)', fontFamily: 'system-ui, sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: '8px', margin: 0 },
    title: { fontSize: '15px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' },
    button: { backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 0px #0369a1' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        <span style={styles.title}>BIT QuickConnect</span>
      </div>
      <button onClick={handleConnect} style={styles.button}>
        <span>CONNECT</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </button>
    </div>
  );
}

export default App;