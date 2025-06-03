// Versión simplificada que funciona mejor con iframes
console.log('CUIT Detector Simple iniciado en:', window.location.href);

let floatingButton = null;

// Función para validar formato CUIT
function isValidCUITFormat(text) {
  const cleanText = text.replace(/[\s\u00A0\u2000-\u200B\u2028\u2029]/g, '');
  const formatWithDashes = /^\d{2}-\d{8}-\d{1}$/;
  const formatWithoutDashes = /^\d{11}$/;
  return formatWithDashes.test(cleanText) || formatWithoutDashes.test(cleanText);
}

// Función para crear y mostrar el botón
function showButton(x, y) {
  hideButton();
  
  const button = document.createElement('div');
  button.style.cssText = `
    position: fixed !important;
    top: ${Math.max(y - 35, 5)}px !important;
    left: ${Math.min(x + 10, window.innerWidth - 85)}px !important;
    z-index: 2147483647 !important;
    background: linear-gradient(135deg, #4CAF50, #45a049) !important;
    color: white !important;
    border: none !important;
    border-radius: 20px !important;
    padding: 8px 12px !important;
    font: bold 12px -apple-system, BlinkMacSystemFont, sans-serif !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    user-select: none !important;
    white-space: nowrap !important;
    opacity: 0 !important;
    transform: scale(0.8) !important;
    transition: all 0.2s ease !important;
  `;
  button.textContent = '📋 ARCA';
  button.title = 'Abrir en ARCA';
  
  button.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Intentar diferentes métodos para abrir la URL
    try {
      if (window.top !== window) {
        // Estamos en iframe, intentar desde el top
        window.top.open('https://www.arca.gob.ar', '_blank');
      } else if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({action: 'openTab', url: 'https://www.arca.gob.ar'});
      } else {
        window.open('https://www.arca.gob.ar', '_blank');
      }
    } catch (ex) {
      // Fallback final
      window.open('https://www.arca.gob.ar', '_blank');
    }
    
    hideButton();
  };
  
  // Añadir hover effects
  button.onmouseenter = function() {
    this.style.transform = 'scale(1.05) translateY(-2px)';
    this.style.background = 'linear-gradient(135deg, #45a049, #3d8b40)';
  };
  
  button.onmouseleave = function() {
    this.style.transform = 'scale(1)';
    this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  };
  
  document.body.appendChild(button);
  floatingButton = button;
  
  // Animación de entrada
  setTimeout(() => {
    if (button.parentNode) {
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    }
  }, 10);
  
  console.log('Botón mostrado en iframe:', window !== window.top);
}

function hideButton() {
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
}

// Función principal
function checkSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text && isValidCUITFormat(text)) {
    console.log('CUIT detectado:', text);
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        showButton(rect.right, rect.top);
        return;
      }
    }
  }
  
  hideButton();
}

// Event listeners optimizados
let selectionTimeout = null;

document.addEventListener('mouseup', function(e) {
  if (floatingButton && floatingButton.contains(e.target)) return;
  
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(checkSelection, 50);
});

document.addEventListener('keyup', function(e) {
  if (e.shiftKey || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(checkSelection, 50);
  }
});

document.addEventListener('mousedown', function(e) {
  if (floatingButton && !floatingButton.contains(e.target)) {
    setTimeout(() => {
      if (!window.getSelection().toString().trim()) {
        hideButton();
      }
    }, 50);
  }
});

document.addEventListener('scroll', hideButton, {passive: true});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') hideButton();
});

console.log('CUIT Detector Simple cargado completamente');