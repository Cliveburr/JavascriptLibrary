import React, { useState } from 'react';
import { TwoAreaLayout, TabItem } from '../../layouts';

export const TwoAreaLayoutDemo: React.FC = () => {
    const [activeTabId, setActiveTabId] = useState<string>('menu');

    const dynamicTabs: TabItem[] = [
        {
            id: 'tab1',
            label: 'Tab Example 1',
            content: (
                <div className="p-lg">
                    <h3 className="text-lg font-semibold mb-md">Dynamic Tab 1</h3>
                    <p className="text-on-surface-variant mb-md">
                        Este é o conteúdo da primeira tab dinâmica. Você pode adicionar qualquer componente aqui.
                        Role para baixo para ver mais conteúdo e testar o scroll independente.
                    </p>
                    <div className="mt-lg">
                        <button className="btn btn-primary mb-md">Botão de Exemplo</button>
                    </div>

                    {/* Conteúdo adicional para testar scroll */}
                    <div className="space-y-md">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="p-md bg-surface rounded border border-outline">
                                <h4 className="font-semibold">Item {i + 1}</h4>
                                <p className="text-sm text-on-surface-variant">
                                    Este é um item de exemplo para demonstrar o scroll independente da área esquerda.
                                    O conteúdo da direita deve rolar independentemente.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'tab2',
            label: 'Tab Example 2',
            content: (
                <div className="p-lg">
                    <h3 className="text-lg font-semibold mb-md">Dynamic Tab 2</h3>
                    <p className="text-on-surface-variant mb-md">
                        Esta é a segunda tab dinâmica com uma lista de exemplo.
                        Role para baixo para ver mais itens.
                    </p>
                    <ul className="list-disc ml-lg space-y-sm">
                        {Array.from({ length: 30 }, (_, i) => (
                            <li key={i} className="text-on-surface-variant">
                                Item {i + 1} da lista - Este é um item de exemplo para demonstrar scroll
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    ];

    return (
        <TwoAreaLayout
            dynamicTabs={dynamicTabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
        >
            <div className="h-full p-xl bg-surface">
                <div className="max-w-4xl">
                    <h1 className="text-3xl font-bold text-on-surface mb-lg">
                        TwoAreaLayout Demo
                    </h1>

                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold text-on-surface mb-md">
                            Características do Layout
                        </h2>

                        <ul className="space-y-sm text-on-surface-variant mb-lg">
                            <li>• <strong>Divisor redimensionável:</strong> Arraste o divisor vertical para ajustar o tamanho das áreas</li>
                            <li>• <strong>Feedback visual:</strong> O separador muda de cor e mostra indicadores visuais quando você passa o mouse</li>
                            <li>• <strong>Área direita mais clara:</strong> Cor de fundo otimizada para leitura de conteúdo</li>
                            <li>• <strong>Persistência:</strong> O tamanho da área esquerda é salvo automaticamente no browser</li>
                            <li>• <strong>Logo e navegação:</strong> Logo clicável no topo que leva para a home</li>
                            <li>• <strong>Dropdown do usuário:</strong> Avatar com iniciais e menu de configuração/logout</li>
                            <li>• <strong>Tabs dinâmicas:</strong> Tab "Menu" fixa + tabs customizáveis por página</li>
                            <li>• <strong>Scroll independente:</strong> Cada área (esquerda e direita) tem scroll próprio</li>
                            <li>• <strong>Responsivo:</strong> Adapta-se a diferentes tamanhos de tela</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-on-surface mb-md">
                            Teste de Scroll Independente
                        </h2>

                        <p className="text-on-surface-variant mb-md">
                            Role esta área para baixo e depois tente rolar o conteúdo da área esquerda nas tabs.
                            Cada área deve rolar independentemente.
                        </p>

                        <h2 className="text-xl font-semibold text-on-surface mb-md">
                            Separador Redimensionável
                        </h2>

                        <div className="bg-surface-variant p-lg rounded-lg mb-lg">
                            <h3 className="text-lg font-semibold mb-md text-on-surface">Como usar o separador:</h3>
                            <ul className="space-y-sm text-on-surface-variant">
                                <li>• <strong>Posicione o mouse</strong> sobre o separador vertical entre as áreas</li>
                                <li>• <strong>Visual melhorado:</strong> Linha dupla fininha com gradiente e sombra suave</li>
                                <li>• <strong>Tamanho fixo:</strong> Separador mantém largura consistente de 8px</li>
                                <li>• <strong>Cursor consistente:</strong> Mouse sempre mostra ↔ no separador</li>
                                <li>• <strong>Feedback visual:</strong> Pontos indicadores mudam de cor durante interação</li>
                                <li>• <strong>Arraste:</strong> Clique e arraste para a esquerda ou direita</li>
                                <li>• <strong>Durante o drag:</strong> Sombra mais pronunciada para feedback</li>
                                <li>• <strong>Limites:</strong> Largura mínima: 250px, máxima: 600px</li>
                                <li>• <strong>Persistência:</strong> O tamanho é salvo automaticamente no localStorage</li>
                                <li>• <strong>Área de interação ampliada:</strong> Facilita o uso em devices touch</li>
                                <li>• <strong>Sombra suave:</strong> Transição visual da área escura (esquerda) para clara (direita)</li>
                            </ul>
                        </div>

                        <h2 className="text-xl font-semibold text-on-surface mb-md">
                            Como usar
                        </h2>

                        <div className="bg-surface-variant p-lg rounded-lg mb-lg">
                            <pre className="text-sm text-on-surface-variant">
                                {`import { TwoAreaLayout, TabItem } from './layouts';

const dynamicTabs: TabItem[] = [
  {
    id: 'custom-tab',
    label: 'Minha Tab',
    content: <div>Conteúdo da tab</div>
  }
];

<TwoAreaLayout
  dynamicTabs={dynamicTabs}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
>
  <div>Conteúdo principal da página</div>
</TwoAreaLayout>`}
                            </pre>
                        </div>

                        <h2 className="text-xl font-semibold text-on-surface mb-md">
                            Área Principal
                        </h2>

                        <p className="text-on-surface-variant mb-md">
                            Esta é a área principal onde o conteúdo da página é renderizado.
                            Ela ocupa todo o espaço disponível após a área esquerda.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-xl">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Card de Exemplo 1</h3>
                                </div>
                                <div className="card-content">
                                    <p>Este é um exemplo de como o conteúdo pode ser organizado na área principal.</p>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Card de Exemplo 2</h3>
                                </div>
                                <div className="card-content">
                                    <p>Você pode adicionar quantos elementos quiser aqui.</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo adicional para demonstrar scroll na área direita */}
                        <h2 className="text-xl font-semibold text-on-surface mb-md mt-xl">
                            Mais Conteúdo para Scroll
                        </h2>

                        <div className="space-y-lg">
                            {Array.from({ length: 15 }, (_, i) => (
                                <div key={i} className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Seção {i + 1}</h3>
                                    </div>
                                    <div className="card-content">
                                        <p className="text-on-surface-variant mb-md">
                                            Esta é a seção {i + 1} do conteúdo principal. O objetivo é demonstrar
                                            que esta área tem scroll independente da área esquerda.
                                        </p>
                                        <p className="text-on-surface-variant">
                                            Quando você rola esta área, o conteúdo da esquerda permanece fixo,
                                            e vice-versa. Isso é especialmente útil em layouts de dashboard
                                            onde você quer manter a navegação sempre visível.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </TwoAreaLayout>
    );
};

export default TwoAreaLayoutDemo;
