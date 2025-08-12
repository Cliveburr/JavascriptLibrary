import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
// using global utilities and card/button framework

export const HomePage: React.FC = () => {
    return (
        <div className="page" style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <section
                className="hero-section bg-hero-radials flex items-center justify-between"
                style={{ minHeight: '80vh', padding: '4rem 4rem', overflow: 'hidden' }}
            >

                <div style={{ flex: 1, maxWidth: 600 }}>
                    <h1 className="page-title">SymbIA v2</h1>
                    <p className="page-subtitle">Multi-memory AI agent platform</p>
                    <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        Experience the future of AI interaction with agents that remember, learn, and execute actions.
                        Each conversation builds lasting memories that enhance every interaction.
                    </p>

                    <div className="flex gap-md">
                        <Link to="/register">
                            <Button variant="primary" size="lg">
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

                <div className="flex items-center justify-center" style={{ flex: 1, maxWidth: 500, height: 400, position: 'relative' }}>
                    {/* Neural network effect */}
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
            </section>

            {/* Features */}
            <section className="features-fade-bg" style={{ padding: '4rem 0' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Core Features</h2>

                    <div className="grid gap-lg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <Card variant="glass" className="hover-raise animate-slide-in">
                            <div className="text-center">
                                <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>🧠</div>
                                <h3 style={{ marginBottom: '.5rem' }}>Multi-Memory System</h3>
                                <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                                    Advanced memory architecture that preserves context across conversations,
                                    enabling truly personalized AI interactions.
                                </p>
                            </div>
                        </Card>

                        <Card variant="glass" className="hover-raise animate-slide-in">
                            <div className="text-center">
                                <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>⚡</div>
                                <h3 style={{ marginBottom: '.5rem' }}>Smart Model Selection</h3>
                                <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                                    Intelligent routing between different AI models based on task requirements,
                                    optimizing for speed and accuracy.
                                </p>
                            </div>
                        </Card>

                        <Card variant="glass" className="hover-raise animate-slide-in">
                            <div className="text-center">
                                <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>🔗</div>
                                <h3 style={{ marginBottom: '.5rem' }}>Action Execution</h3>
                                <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                                    Seamless integration with external tools and services,
                                    enabling AI agents to take real-world actions.
                                </p>
                            </div>
                        </Card>

                        <Card variant="glass" className="hover-raise animate-slide-in">
                            <div className="text-center">
                                <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>🎯</div>
                                <h3 style={{ marginBottom: '.5rem' }}>Adaptive Learning</h3>
                                <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                                    Continuous learning from interactions to improve responses
                                    and better understand user preferences over time.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 0' }}>
                <div>
                    <Card variant="elevated" glow>
                        <div className="text-center" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '.75rem', background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' as any }}>
                                Ready to Experience the Future?
                            </h2>
                            <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '1.5rem', maxWidth: 600, marginInline: 'auto' }}>
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
            </section>
        </div>
    );
};
