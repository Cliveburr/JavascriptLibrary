import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { setUser, setLoading, setError, isLoading, error } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Chamar API de login
      const response = await apiService.auth.login({
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login successful:', response.data);
      
      // Salvar token no localStorage - verificar diferentes estruturas de resposta
      let token = null;
      if (response.data.data?.token) {
        token = response.data.data.token;
      } else if (response.data.token) {
        token = response.data.token;
      }
      
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      // Criar objeto de usuário
      const user = {
        username: formData.username,
        name: formData.username, // Usar o username como nome por enquanto
        token: token
      };
      
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      // Tratar diferentes tipos de erro
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('Credenciais inválidas. Verifique seu usuário e senha.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box">
                <div className="has-text-centered mb-4">
                  <h1 className="title is-3">Entrar</h1>
                  <p className="subtitle is-6">Acesse sua conta no SymbIA</p>
                </div>

                {error && (
                  <div className="notification is-danger is-light">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Nome de usuário</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="Seu nome de usuário"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Senha</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <button 
                        className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                        type="submit"
                        disabled={isLoading}
                      >
                        Entrar
                      </button>
                    </div>
                  </div>
                </form>

                <div className="has-text-centered mt-4">
                  <p>
                    Não tem uma conta? 
                    <Link to="/register" className="has-text-primary ml-1">
                      Registre-se aqui
                    </Link>
                  </p>
                  <Link to="/" className="has-text-grey">
                    Voltar para home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
