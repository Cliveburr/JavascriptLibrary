import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import './HomePage.scss';

export const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <div className="home-page__hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="text-gradient">SymbIA</span> v2
                    </h1>
                    <p className="hero-subtitle">
                        Multi-memory AI agent platform
                    </p>
                    <p className="hero-description">
                        Experience the future of AI interaction with agents that remember, learn, and execute actions.
                        Each conversation builds lasting memories that enhance every interaction.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register">
                            <Button variant="primary" size="lg" className="animate-glow">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="neural-network">
                        <div className="neural-node neural-node--1"></div>
                        <div className="neural-node neural-node--2"></div>
                        <div className="neural-node neural-node--3"></div>
                        <div className="neural-node neural-node--4"></div>
                        <div className="neural-node neural-node--5"></div>
                        <div className="neural-connection neural-connection--1"></div>
                        <div className="neural-connection neural-connection--2"></div>
                        <div className="neural-connection neural-connection--3"></div>
                    </div>
                </div>
            </div>

            <div className="home-page__features">
                <div className="container">
                    <h2 className="features-title">Core Features</h2>

                    <div className="features-grid">
                        <Card variant="glass" className="feature-card animate-slide-in">
                            <div className="feature-icon">🧠</div>
                            <h3>Multi-Memory System</h3>
                            <p>
                                Advanced memory architecture that preserves context across conversations,
                                enabling truly personalized AI interactions.
                            </p>
                        </Card>

                        <Card variant="glass" className="feature-card animate-slide-in">
                            <div className="feature-icon">⚡</div>
                            <h3>Smart Model Selection</h3>
                            <p>
                                Intelligent routing between different AI models based on task requirements,
                                optimizing for speed and accuracy.
                            </p>
                        </Card>

                        <Card variant="glass" className="feature-card animate-slide-in">
                            <div className="feature-icon">🔗</div>
                            <h3>Action Execution</h3>
                            <p>
                                Seamless integration with external tools and services,
                                enabling AI agents to take real-world actions.
                            </p>
                        </Card>

                        <Card variant="glass" className="feature-card animate-slide-in">
                            <div className="feature-icon">🎯</div>
                            <h3>Adaptive Learning</h3>
                            <p>
                                Continuous learning from interactions to improve responses
                                and better understand user preferences over time.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="home-page__cta">
                <div className="container">
                    <Card variant="elevated" glow className="cta-card">
                        <div className="cta-content">
                            <h2>Ready to Experience the Future?</h2>
                            <p>
                                Join the next generation of AI interaction. Build, learn, and grow with SymbIA.
                            </p>
                            <Link to="/register">
                                <Button variant="accent" size="lg">
                                    Start Your Journey
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
