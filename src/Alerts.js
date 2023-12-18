const toastDetails = {
    timer: 5000,
    success: {
      icon: 'fa-circle-check'
    },
    error: {
      icon: 'fa-circle-xmark'
    },
    warning: {
      icon: 'fa-triangle-exclamation'
    },
    info: {
      icon: 'fa-circle-info'
    }
  };
  
  class ToastCreator {
    constructor(notifications) {
      this.notifications = notifications;
    }
  
    removeToast(toast) {
      toast.classList.add("hide");
      if (toast.timeoutId) clearTimeout(toast.timeoutId);
      setTimeout(() => toast.remove(), 500);
    }
  
    createToast = (id, customText) => {
      const { icon } = toastDetails[id];
      const text = customText ? customText : toastDetails[id].text;
      const toast = document.createElement("li");
      toast.className = `Cartel ${id}`;
      toast.innerHTML = `<div class="column">
                           <i class="fa-solid ${icon}"></i>
                           <span>${text}</span>
                        </div>
                        <i class="fa-solid fa-xmark" onclick="this.parentElement.parentElement.remove()"></i>`;
      this.notifications.appendChild(toast);
      toast.timeoutId = setTimeout(() => this.removeToast(toast), toastDetails.timer);
    }
  }

  function obtenerValorInput(inputId) {
    const inputElement = document.getElementById(inputId);
    
    if (inputElement) {
      const valor = inputElement.value;
      return { id: inputId, valor: valor };
    } else {
      throw new Error('No se encontró el input');
    }
  }

  function cargarSweetAlert() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
  export { ToastCreator, obtenerValorInput , cargarSweetAlert };