// THEME SWITCHER EXAMPLE
// ==================================================
// Este arquivo mostra como implementar a troca de temas no futuro

import '../styles/theme-futuristic-dark.scss';
import '../styles/theme-blue-twilight.scss';

export type ThemeName = 'futuristic-dark' | 'blue-twilight';

export class ThemeManager {
    private currentTheme: ThemeName = 'blue-twilight'; // Tema padrão

    constructor() {
        this.loadTheme();
    }

    /**
     * Aplica um tema específico
     */
    setTheme(themeName: ThemeName): void {
        const root = document.documentElement;

        // Remove classes de tema anteriores
        root.classList.remove('theme-futuristic-dark', 'theme-blue-twilight');

        // Adiciona a nova classe de tema
        root.classList.add(`theme-${themeName}`);

        this.currentTheme = themeName;

        // Salva a preferência no localStorage
        localStorage.setItem('symbia-theme', themeName);

        // Dispara evento customizado para componentes que precisam reagir
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }

    /**
     * Retorna o tema atual
     */
    getCurrentTheme(): ThemeName {
        return this.currentTheme;
    }

    /**
     * Alterna entre os temas disponíveis
     */
    toggleTheme(): void {
        const nextTheme: ThemeName = this.currentTheme === 'blue-twilight'
            ? 'futuristic-dark'
            : 'blue-twilight';

        this.setTheme(nextTheme);
    }

    /**
     * Carrega o tema salvo do localStorage
     */
    private loadTheme(): void {
        const savedTheme = localStorage.getItem('symbia-theme') as ThemeName;

        if (savedTheme && (savedTheme === 'futuristic-dark' || savedTheme === 'blue-twilight')) {
            this.setTheme(savedTheme);
        } else {
            // Aplica tema padrão
            this.setTheme('blue-twilight');
        }
    }

    /**
     * Detecta preferência do sistema (dark/light mode)
     */
    detectSystemPreference(): 'dark' | 'light' {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
}

// CSS Classes que serão adicionadas ao :root para alternar temas
/*
Adicionar ao globals.scss:

:root.theme-futuristic-dark {
    @include futuristic.apply-futuristic-dark-theme;
}

:root.theme-blue-twilight {
    @include blue.apply-blue-twilight-theme;
}
*/

// Exemplo de uso em um componente React:
/*
import { ThemeManager } from './theme-manager';

const themeManager = new ThemeManager();

// Trocar tema
themeManager.setTheme('futuristic-dark');

// Alternar tema
themeManager.toggleTheme();

// Escutar mudanças de tema
window.addEventListener('themeChanged', (event) => {
    console.log('Novo tema:', event.detail.theme);
});
*/

export default ThemeManager;
