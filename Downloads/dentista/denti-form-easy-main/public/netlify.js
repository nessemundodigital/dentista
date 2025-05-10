
// This file verifies Netlify is correctly serving static assets
console.log('Netlify configuration loaded successfully');
document.addEventListener('DOMContentLoaded', () => {
  console.log('Current path:', window.location.pathname);
  console.log('Current URL:', window.location.href);
});
