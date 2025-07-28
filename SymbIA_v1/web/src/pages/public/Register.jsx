import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || formData.username.trim().length < 3) {
      setError('O nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Chamar API de registro
      const response = await apiService.auth.register({
        username: formData.username,
        password: formData.password
      });
      
      console.log('Registration successful:', response.data);
      setSuccess(true);
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      // Tratar diferentes tipos de erro
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.details) {
        setError(err.response.data.details);
      } else if (err.response?.status === 400) {
        setError('Dados inválidos. Verifique os campos preenchidos.');
      } else if (err.message) {
        setError(`Erro: ${err.message}`);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="notification is-success">
              <h1 className="title">Conta criada com sucesso!</h1>
              <p>Você será redirecionado para a página de login...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box">
                <div className="has-text-centered mb-4">
                  <h1 className="title is-3">Registrar</h1>
                  <p className="subtitle is-6">Crie sua conta no SymbIA</p>
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
                        placeholder="Seu nome de usuário (mín. 3 caracteres)"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        minLength="3"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <p className="help">Use apenas letras, números e sublinhados</p>
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
                        minLength="6"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Confirmar senha</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
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
                        Criar conta
                      </button>
                    </div>
                  </div>
                </form>

                <div className="has-text-centered mt-4">
                  <p>
                    Já tem uma conta? 
                    <Link to="/login" className="has-text-primary ml-1">
                      Entre aqui
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

export default Register;
