(function () {
  if (!auth.getToken()) {
    window.location.href = 'login.html';
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.cover-footer');
    if (!footer) return;
    const user = auth.getUser();
    footer.innerHTML = `
      ${user && user.email ? `<div class="cover-user">${escapeHtml(user.email)}</div>` : ''}
      <a href="#" id="btn-logout" class="cover-logout">Se déconnecter</a>
    `;
    document.getElementById('btn-logout').addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout();
    });
  });
})();