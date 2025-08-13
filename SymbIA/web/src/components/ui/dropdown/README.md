# 📋 Dropdown Component

## 📋 **Visão Geral**

O componente Dropdown é um componente flexível e completo para criar menus suspensos, seletores e conteúdo contextual. Oferece três modos de uso: menu padrão, template customizado e conteúdo totalmente personalizado.

## 🚀 **Instalação e Uso**

```tsx
import { 
  Dropdown, 
  createDropdownItem, 
  createDropdownDivider,
  type DropdownMenuItem 
} from '../ui/dropdown';
```

## 🎯 **Modos de Uso**

### **1. Menu Padrão (com items)**

```tsx
import { Dropdown, createDropdownItem, createDropdownDivider } from '../ui/dropdown';

const menuItems = [
  createDropdownItem('profile', 'Profile', { 
    icon: <UserIcon />,
    onClick: () => console.log('Profile clicked')
  }),
  createDropdownItem('settings', 'Settings', { 
    icon: <SettingsIcon />,
    onClick: () => console.log('Settings clicked')
  }),
  createDropdownDivider('divider1'),
  createDropdownItem('logout', 'Logout', { 
    icon: <LogoutIcon />,
    onClick: () => console.log('Logout clicked')
  })
];

<Dropdown
  placeholder="Select Option"
  items={menuItems}
  onSelect={(item) => console.log('Selected:', item)}
/>
```

### **2. Template Customizado**

```tsx
const renderTemplate = (data: any) => (
  <div className="p-md">
    <h4 className="text-sm font-bold mb-sm">Users Online</h4>
    {data.users.map((user: string, index: number) => (
      <div 
        key={index} 
        className="flex items-center p-sm hover:bg-bg-tertiary rounded cursor-pointer"
        onClick={() => console.log(`Selected user: ${user}`)}
      >
        <div className="w-6 h-6 bg-success rounded-full mr-sm">
          <span className="text-xs text-white">{user[0]}</span>
        </div>
        <span>{user}</span>
      </div>
    ))}
  </div>
);

<Dropdown
  placeholder="Users"
  template={renderTemplate}
  templateData={{ users: ['Alice', 'Bob', 'Charlie'] }}
/>
```

### **3. Conteúdo Customizado**

```tsx
<Dropdown placeholder="Custom Content">
  <div className="p-md">
    <h4 className="text-sm font-bold mb-sm">Quick Actions</h4>
    <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs">
      Create new file
    </button>
    <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs">
      Open folder
    </button>
    <div className="border-t border-border my-sm"></div>
    <input 
      type="text" 
      className="w-full bg-bg-primary border border-border rounded px-sm py-xs"
      placeholder="Search..."
    />
  </div>
</Dropdown>
```

## 🎨 **Variações de Estilo**

### **Tamanhos**
```tsx
<Dropdown size="sm" placeholder="Small" items={menuItems} />
<Dropdown size="md" placeholder="Medium" items={menuItems} />
<Dropdown size="lg" placeholder="Large" items={menuItems} />
```

### **Cores**
```tsx
<Dropdown variant="default" placeholder="Default" items={menuItems} />
<Dropdown variant="primary" placeholder="Primary" items={menuItems} />
<Dropdown variant="secondary" placeholder="Secondary" items={menuItems} />
<Dropdown variant="accent" placeholder="Accent" items={menuItems} />
<Dropdown variant="outline" placeholder="Outline" items={menuItems} />
```

### **Border Radius**
```tsx
<Dropdown borderRadius="sm" placeholder="Small Radius" items={menuItems} />
<Dropdown borderRadius="md" placeholder="Medium Radius" items={menuItems} />
<Dropdown borderRadius="lg" placeholder="Large Radius" items={menuItems} />
<Dropdown borderRadius="xl" placeholder="XL Radius" items={menuItems} />
<Dropdown borderRadius="full" placeholder="Full Radius" items={menuItems} />
```

### **Largura Completa**
```tsx
<Dropdown fullWidth placeholder="Full Width" items={menuItems} />
```

## ⚙️ **Props Interface**

```tsx
interface DropdownProps {
  // Conteúdo do trigger
  trigger?: ReactNode;
  placeholder?: string;
  
  // Comportamento
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
  closeOnSelect?: boolean;
  
  // Posicionamento
  position?: 'bottom' | 'top' | 'auto';
  align?: 'left' | 'right' | 'center';
  
  // Variações visuais
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fullWidth?: boolean;
  
  // Modo menu (padrão)
  items?: DropdownItem[];
  
  // Modo template
  template?: (data: any) => ReactElement;
  templateData?: any;
  
  // Modo conteúdo customizado
  children?: ReactNode;
  
  // Callbacks
  onSelect?: (item: DropdownMenuItem) => void;
  
  // Classes adicionais
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  
  // Ícones
  icon?: ReactNode;
  showCaret?: boolean;
}
```

## 🛠️ **Funções Helper**

### **createDropdownItem**
Cria um item de menu com configurações:

```tsx
const item = createDropdownItem(
  'unique-id',
  'Label Text',
  {
    icon: <SomeIcon />,
    disabled: false,
    selected: false,
    onClick: () => console.log('clicked')
  }
);
```

### **createDropdownDivider**
Cria uma linha divisória:

```tsx
const divider = createDropdownDivider('unique-divider-id');
```

## 🎛️ **Controle de Estado**

### **Controlado**
```tsx
const [isOpen, setIsOpen] = useState(false);

<Dropdown
  isOpen={isOpen}
  onToggle={setIsOpen}
  placeholder="Controlled Dropdown"
  items={menuItems}
/>
```

### **Não Controlado**
```tsx
<Dropdown
  placeholder="Uncontrolled Dropdown"
  items={menuItems}
  onSelect={(item) => console.log('Selected:', item)}
/>
```

## 🔧 **Posicionamento Avançado**

```tsx
// Posição automática (calcula o melhor local)
<Dropdown position="auto" items={menuItems} />

// Sempre acima
<Dropdown position="top" items={menuItems} />

// Sempre abaixo (padrão)
<Dropdown position="bottom" items={menuItems} />
```

## 🎨 **Classes CSS Disponíveis**

### **Container Principal**
- `.dropdown` - Container base
- `.dropdown--sm`, `.dropdown--lg` - Tamanhos
- `.dropdown--primary`, `.dropdown--secondary`, `.dropdown--accent`, `.dropdown--outline` - Cores
- `.dropdown--rounded-sm`, `.dropdown--rounded-lg`, `.dropdown--rounded-xl`, `.dropdown--rounded-full` - Border radius
- `.dropdown--full-width` - Largura completa

### **Trigger**
- `.dropdown__trigger` - Botão principal
- `.dropdown__trigger--open` - Estado aberto
- `.dropdown__trigger--disabled` - Estado desabilitado

### **Conteúdo**
- `.dropdown__content` - Container do conteúdo
- `.dropdown__content--open` - Estado aberto (visível)
- `.dropdown__content--above` - Posicionado acima

### **Menu e Items**
- `.dropdown__menu` - Container dos itens
- `.dropdown__item` - Item individual
- `.dropdown__item--selected` - Item selecionado
- `.dropdown__item--disabled` - Item desabilitado
- `.dropdown__item-icon` - Ícone do item
- `.dropdown__item-text` - Texto do item
- `.dropdown__divider` - Divisória

## ♿ **Acessibilidade**

O componente inclui suporte completo à acessibilidade:

- **Navegação por teclado**: Setas, Enter, Escape
- **ARIA attributes**: `aria-expanded`, `aria-haspopup`
- **Focus management**: Foco adequado entre elementos
- **Screen reader support**: Labels e roles corretos

## 🔍 **Exemplo Completo**

```tsx
import React, { useState } from 'react';
import { Dropdown, createDropdownItem, createDropdownDivider } from '../ui/dropdown';

const MyComponent = () => {
  const [selectedOption, setSelectedOption] = useState('option1');
  
  const options = [
    createDropdownItem('option1', 'Option 1', { 
      selected: selectedOption === 'option1',
      onClick: () => setSelectedOption('option1')
    }),
    createDropdownItem('option2', 'Option 2', { 
      selected: selectedOption === 'option2',
      onClick: () => setSelectedOption('option2')
    }),
    createDropdownDivider('div1'),
    createDropdownItem('reset', 'Reset Selection', { 
      onClick: () => setSelectedOption('')
    })
  ];

  return (
    <div className="p-lg">
      <Dropdown
        variant="primary"
        size="md"
        borderRadius="lg"
        placeholder="Choose an option"
        items={options}
        onSelect={(item) => console.log('Selected:', item)}
      />
      
      <p className="mt-md text-text-secondary">
        Current selection: {selectedOption || 'None'}
      </p>
    </div>
  );
};
```

## 🐛 **Debugging**

Para testar o componente, acesse: `/debug/dropdown` na aplicação.

## 📚 **Recursos Adicionais**

- **Framework Documentation**: `docs/framework/components.md`
- **Style Variables**: `web/src/styles/_variables.scss`
- **Component Styles**: `web/src/styles/framework/components/interactive/_dropdown.scss`
