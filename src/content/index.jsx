import ReactDOM from 'react-dom/client';
import App from '../App';

const initExtension = () => {
  if (document.getElementById('wifi-auto-login-root')) return;

  // 1. Identify ANY BIT portal signature element (ADDED user_id and password for Page 1)
  const hasLoginFields = document.querySelector('input[name="username"], input[name="newpasswd"], input[name="user_id"], input[name="password"]');
  const hasDeleteBtn = document.querySelector('input[value*="Delete"]');
  const hasGoToLogin = document.querySelector('input[value*="Go to Login"]');
  const hasWelcome = document.body.innerText.includes("Welcome! You are logged in");
  const hasAlreadyLoggedIn = document.body.innerText.includes("Already logged in.");
  const hasLoginSuccessful = document.body.innerText.includes("Login successful.");
  const hasLoginFailed = document.body.innerText.includes("Incorrect User Name / Password.");

  if (!(hasLoginFields || hasDeleteBtn || hasGoToLogin || hasWelcome || hasAlreadyLoggedIn || hasLoginSuccessful || hasLoginFailed)) {
    return;
  }

  // 2. Target the BIT containers
  const targetContainer = document.querySelector('.loginLeft') ||
    document.querySelector('.errorContent') ||
    document.querySelector('.loginContent') ||
    document.body;

  const rootElement = document.createElement('div');
  rootElement.id = 'wifi-auto-login-root';
  rootElement.style.cssText = "margin-bottom: 20px; width: 100%; display: flex; justify-content: center;";

  targetContainer.prepend(rootElement);
  ReactDOM.createRoot(rootElement).render(<App />);

  console.log("BIT QuickConnect: Mounted on current stage.");
};

if (document.readyState === 'complete') {
  initExtension();
} else {
  window.addEventListener('load', initExtension);
}