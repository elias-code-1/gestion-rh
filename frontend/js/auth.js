if (auth.getToken()) {
  window.location.href = 'index.html';
}

function showAuthError(message) {
  const box = document.getElementById('auth-error');
  if (!box) return;
  box.textContent = message;
  box.classList.add('show');
}

function hideAuthError() {
  const box = document.getElementById('auth-error');
  if (box) box.classList.remove('show');
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAuthError();
    const submitBtn = document.getElementById('login-submit');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion…';
    try {
      const data = await api.post('/auth/login', { email, password });
      auth.setSession(data.token, data.user);
      window.location.href = 'index.html';
    } catch (err) {
      showAuthError(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
    }
  });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAuthError();
    const submitBtn = document.getElementById('signup-submit');
    const nom = document.getElementById('signup-nom').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Création…';
    try {
      const data = await api.post('/auth/signup', { nom, email, password });
      auth.setSession(data.token, data.user);
      window.location.href = 'index.html';
    } catch (err) {
      showAuthError(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Créer mon compte';
    }
  });
}