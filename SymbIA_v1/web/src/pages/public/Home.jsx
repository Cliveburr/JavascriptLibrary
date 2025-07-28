import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="hero is-primary is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">SymbIA</h1>
                    <h2 className="subtitle is-3">Sistema Inteligente de Análise Simbólica</h2>
                    <p className="is-size-5 mb-6">
                        Bem-vindo ao SymbIA! Uma plataforma avançada para análise e processamento de dados 
                        utilizando inteligência artificial e computação simbólica.
                    </p>
                    <div className="buttons is-centered">
                        <Link to="/login" className="button is-light is-large">
                            <span className="icon">
                                <i className="fas fa-sign-in-alt"></i>
                            </span>
                            <span>Entrar</span>
                        </Link>
                        <Link to="/register" className="button is-info is-large">
                            <span className="icon">
                                <i className="fas fa-user-plus"></i>
                            </span>
                            <span>Registrar</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
