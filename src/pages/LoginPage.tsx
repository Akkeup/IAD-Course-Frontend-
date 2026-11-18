import { useState } from 'react';
import { http, errorMessage } from '../api/http';
import { useAppDispatch } from '../store/hooks';
import { loggedIn } from '../store/authSlice';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const response = await http.post<{ username?: string }>('/auth/login', { username, password });
      dispatch(loggedIn(response.data?.username || username));
      window.location.hash = '#/catalog';
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return <>
    <p className="status-label">Авторизация</p>
    <h1>Вход</h1>
    <p className="unsaved-badge login-badge">JWT-сессия в cookie</p>
    <form className="draft-form login-form" onSubmit={submit}>
      <label className="field field--wide"><span>Имя пользователя</span><input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" /></label>
      <label className="field field--wide"><span>Пароль</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="action-button action-button--wide" type="submit">Войти</button>
    </form>
  </>;
}
