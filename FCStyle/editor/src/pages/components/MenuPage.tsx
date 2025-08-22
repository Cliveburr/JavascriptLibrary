import React, { useState } from 'react'
import { Menu, ListItem, ListSeparator, ListLabel, ListSubList, Columns, Place } from 'fcstyle'

const MenuPage: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('option1');
  const [selectedHorizontal, setSelectedHorizontal] = useState<string>('home');

  const handleItemSelect = (value: string) => {
    setSelectedValue(value);
  };

  const handleHorizontalSelect = (value: string) => {
    setSelectedHorizontal(value);
    console.log('Horizontal Selected:', value);
  };

  return (
    <Columns gap m>
      <Place w5>
        <h3>Menu Vertical</h3>
        <Menu b white sh3 selectedValue={selectedValue} onItemSelect={handleItemSelect}>
          <ListLabel>Seção Principal</ListLabel>
          <ListItem value="option1" li="home">Página Inicial</ListItem>
          <ListItem value="option2" li="user">Perfil</ListItem>
          <ListItem value="option3" li="settings">Configurações</ListItem>
          
          <ListSeparator />
          
          <ListSubList label="Submenu" li="folder" defaultExpanded>
            <ListItem value="sub1" li="file">Item 1</ListItem>
            <ListItem value="sub2" li="file">Item 2</ListItem>
            <ListItem value="sub3" li="file">Item 3</ListItem>
          </ListSubList>

          <ListSubList label="Outro Submenu" li="cog">
            <ListItem value="sub4" li="star">Favoritos</ListItem>
            <ListItem value="sub5" li="heart">Curtidos</ListItem>
          </ListSubList>
          
          <ListSeparator />
          
          <ListLabel>Ações</ListLabel>
          <ListItem value="logout" li="sign-out">Sair</ListItem>
          <ListItem value="disabled" li="ban" disabled>Desabilitado</ListItem>
        </Menu>
      </Place>

      <div>
        <h3>Menu Horizontal</h3>
        <Menu 
          horizontal
          selectedValue={selectedHorizontal} 
          onItemSelect={handleHorizontalSelect}
        >
          <ListItem value="home" li="home">Home</ListItem>
          <ListItem value="about" li="info">Sobre</ListItem>
          <ListSeparator />
          <ListItem value="contact" li="envelope">Contato</ListItem>
          <ListSubList label="Mais" li="ellipsis-h">
            <ListItem value="help" li="question">Ajuda</ListItem>
            <ListItem value="docs" li="book">Documentação</ListItem>
          </ListSubList>
        </Menu>
      </div>

      <div>
        <h3>Menu com Ícones e Estados</h3>
        <Menu selectedValue={selectedValue} onItemSelect={handleItemSelect}>
          <ListItem value="new" li="plus" ri="keyboard">Novo (Ctrl+N)</ListItem>
          <ListItem value="open" li="folder-open" ri="keyboard">Abrir (Ctrl+O)</ListItem>
          <ListItem value="save" li="save" ri="keyboard">Salvar (Ctrl+S)</ListItem>
          
          <ListSeparator />
          
          <ListItem value="cut" li="cut" disabled>Recortar</ListItem>
          <ListItem value="copy" li="copy">Copiar</ListItem>
          <ListItem value="paste" li="paste">Colar</ListItem>
        </Menu>
      </div>

      <div>
        <h3>Menu Aninhado Complexo</h3>
        <Menu b one selectedValue={selectedValue} onItemSelect={handleItemSelect}>
          <ListLabel>Navegação</ListLabel>
          <ListItem value="dashboard" li="tachometer-alt">Dashboard</ListItem>
          
          <ListSubList label="Projetos" li="project-diagram" defaultExpanded>
            <ListItem value="all-projects" li="list">Todos os Projetos</ListItem>
            <ListItem value="my-projects" li="user">Meus Projetos</ListItem>
            
            <ListSubList label="Por Status" li="filter">
              <ListItem value="active" li="check-circle">Ativos</ListItem>
              <ListItem value="completed" li="check">Concluídos</ListItem>
              <ListItem value="archived" li="archive">Arquivados</ListItem>
            </ListSubList>
          </ListSubList>

          <ListSubList label="Relatórios" li="chart-bar">
            <ListItem value="sales" li="dollar-sign">Vendas</ListItem>
            <ListItem value="performance" li="chart-line">Performance</ListItem>
          </ListSubList>
          
          <ListSeparator />
          
          <ListLabel>Sistema</ListLabel>
          <ListItem value="admin" li="shield-alt">Administração</ListItem>
          <ListItem value="logout" li="sign-out" ri="power-off">Sair</ListItem>
        </Menu>
      </div>
    </Columns>
  )
}

export default MenuPage
