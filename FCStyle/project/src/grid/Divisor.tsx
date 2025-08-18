import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface DivisorProps {
  /**
   * Direção do divisor
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  
  /**
   * Nome para salvar no localStorage
   */
  name?: string;
  
  /**
   * Callback chamado quando o tamanho muda (opcional)
   */
  onResize?: (size: number) => void;
  
  /**
   * Tamanho inicial em pixels
   */
  initialSize?: number;
  
  /**
   * Tamanho mínimo em pixels
   * @default 10
   */
  minSize?: number;
  
  /**
   * Tamanho máximo em pixels
   */
  maxSize?: number;
  
  /**
   * Espessura do divisor em pixels
   * @default 4
   */
  thickness?: number;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: React.CSSProperties;

  /**
   * Conteúdo do primeiro painel (esquerda/topo)
   */
  children?: [React.ReactNode, React.ReactNode];

  /**
   * Conteúdo do primeiro painel (esquerda/topo) - alternativa
   */
  firstPanel?: React.ReactNode;

  /**
   * Conteúdo do segundo painel (direita/baixo)
   */
  secondPanel?: React.ReactNode;
}

export const Divisor: React.FC<DivisorProps> = ({
  direction = 'vertical',
  name,
  onResize,
  initialSize = 200,
  minSize = 10,
  maxSize,
  thickness = 4,
  className = '',
  style = {},
  children,
  firstPanel,
  secondPanel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startMousePos, setStartMousePos] = useState(0);
  const [startSize, setStartSize] = useState(0);
  const [currentSize, setCurrentSize] = useState<number>(() => {
    // Tenta carregar do localStorage se name foi fornecido
    if (name) {
      const saved = localStorage.getItem(`divisor-${name}`);
      if (saved) {
        const parsedSize = parseInt(saved, 10);
        return !isNaN(parsedSize) ? parsedSize : initialSize;
      }
    }
    return initialSize;
  });

  // Salva no localStorage quando o tamanho muda
  useEffect(() => {
    if (name) {
      localStorage.setItem(`divisor-${name}`, currentSize.toString());
    }
  }, [currentSize, name]);

  // Notifica o componente pai sobre mudanças de tamanho (opcional)
  useEffect(() => {
    onResize?.(currentSize);
  }, [currentSize, onResize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mousePos = direction === 'vertical' ? e.clientX : e.clientY;
    setStartMousePos(mousePos);
    setStartSize(currentSize);
    setIsDragging(true);
    
    document.body.style.cursor = direction === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [direction, currentSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const currentMousePos = direction === 'vertical' ? e.clientX : e.clientY;
    const deltaPos = currentMousePos - startMousePos;
    let newSize = startSize + deltaPos;

    // Aplica limitações de tamanho
    if (newSize < minSize) newSize = minSize;
    if (maxSize && newSize > maxSize) newSize = maxSize;

    setCurrentSize(newSize);
  }, [isDragging, direction, startMousePos, startSize, minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Event listeners para mouse
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getContainerStyles = (): React.CSSProperties => {
    return {
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'row' : 'column',
      height: '100%',
      width: '100%',
      ...style
    };
  };

  const getFirstPanelStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      overflow: 'auto',
      flexShrink: 0,
    };

    if (direction === 'vertical') {
      baseStyles.width = `${currentSize}px`;
      baseStyles.height = '100%';
    } else {
      baseStyles.height = `${currentSize}px`;
      baseStyles.width = '100%';
    }

    return baseStyles;
  };

  const getSecondPanelStyles = (): React.CSSProperties => {
    return {
      flex: 1,
      overflow: 'auto',
      minWidth: 0,
      minHeight: 0,
    };
  };

  const getDivisorStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      backgroundColor: isDragging ? '#007acc' : '#e0e0e0',
      cursor: direction === 'vertical' ? 'ew-resize' : 'ns-resize',
      userSelect: 'none',
      flexShrink: 0,
      transition: isDragging ? 'none' : 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (direction === 'vertical') {
      baseStyles.width = `${thickness}px`;
      baseStyles.height = '100%';
    } else {
      baseStyles.height = `${thickness}px`;
      baseStyles.width = '100%';
    }

    return baseStyles;
  };

  const getIndicatorStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '1px',
      pointerEvents: 'none',
    };

    if (direction === 'vertical') {
      baseStyles.width = '2px';
      baseStyles.height = '20px';
    } else {
      baseStyles.width = '20px';
      baseStyles.height = '2px';
    }

    return baseStyles;
  };

  // Determina o conteúdo dos painéis
  const [panel1, panel2] = children || [firstPanel, secondPanel];

  return (
    <div
      ref={containerRef}
      className={`fc-divisor-container fc-divisor-container--${direction} ${className}`.trim()}
      style={getContainerStyles()}
    >
      {/* Primeiro painel */}
      <div className="fc-divisor-panel" style={getFirstPanelStyles()}>
        {panel1}
      </div>

      {/* Divisor */}
      <div
        className={`fc-divisor fc-divisor--${direction} ${isDragging ? 'fc-divisor--dragging' : ''}`.trim()}
        style={getDivisorStyles()}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#c0c0c0';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e0e0e0';
          }
        }}
        data-size={currentSize}
        data-direction={direction}
        data-name={name}
      >
        <div style={getIndicatorStyles()} />
      </div>

      {/* Segundo painel */}
      <div className="fc-divisor-panel" style={getSecondPanelStyles()}>
        {panel2}
      </div>
    </div>
  );
};

export default Divisor;
