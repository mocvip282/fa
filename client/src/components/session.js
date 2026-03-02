export function setSession({ authToken, role, profile }) {
  localStorage.setItem('fa_auth_token', authToken);
  localStorage.setItem('fa_role', role);
  localStorage.setItem('fa_profile', JSON.stringify(profile));
}

export function clearSession() {
  localStorage.removeItem('fa_auth_token');
  localStorage.removeItem('fa_role');
  localStorage.removeItem('fa_profile');
}

export function getRole() {
  return localStorage.getItem('fa_role');
}

export function getStoredProfile() {
  const raw = localStorage.getItem('fa_profile');
  return raw ? JSON.parse(raw) : null;
}
