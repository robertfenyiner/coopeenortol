// Main JavaScript functionality for Fincomercio clone

interface CarouselSlide {
  element: HTMLElement;
  index: number;
}

class FincomercioApp {
  private currentSlide = 0;
  private slides: CarouselSlide[] = [];
  private dots: NodeListOf<HTMLElement> = document.querySelectorAll('.dot');
  private mobileMenuOpen = false;
  private startX = 0;
  private endX = 0;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupCarousel();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupAnimations();
    this.setupChatbot();
    this.setupCardHovers();
    this.setupFormValidation();
  }

  // Carousel functionality
  private setupCarousel(): void {
    const slideElements = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.dot');

    slideElements.forEach((slide, index) => {
      this.slides.push({
        element: slide as HTMLElement,
        index
      });
    });

    // Auto-play carousel
    setInterval(() => {
      this.nextSlide();
    }, 5000);

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // Touch/swipe support
    this.setupSwipeGestures();
  }

  private nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarousel();
  }

  private goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateCarousel();
  }

  private updateCarousel(): void {
    // Update slide visibility
    this.slides.forEach((slide, index) => {
      slide.element.classList.toggle('active', index === this.currentSlide);
    });

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  private setupSwipeGestures(): void {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    carousel.addEventListener('touchstart', (e: Event) => {
      const touchEvent = e as TouchEvent;
      this.startX = touchEvent.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e: Event) => {
      const touchEvent = e as TouchEvent;
      this.endX = touchEvent.changedTouches[0].clientX;
      this.handleSwipe();
    });

    carousel.addEventListener('mousedown', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      this.startX = mouseEvent.clientX;
      carousel.addEventListener('mousemove', this.handleMouseMove);
    });

    carousel.addEventListener('mouseup', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      this.endX = mouseEvent.clientX;
      this.handleSwipe();
      carousel.removeEventListener('mousemove', this.handleMouseMove);
    });
  }

  private handleMouseMove = (e: Event): void => {
    e.preventDefault();
  };

  private handleSwipe(): void {
    const threshold = 50;
    const diff = this.startX - this.endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
      }
    }
  }

  // Mobile menu functionality
  private setupMobileMenu(): void {
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');

    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      menuBtn.classList.toggle('active', this.mobileMenuOpen);
      nav.classList.toggle('mobile-open', this.mobileMenuOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target as Node) && !menuBtn.contains(e.target as Node)) {
        this.mobileMenuOpen = false;
        menuBtn.classList.remove('active');
        nav.classList.remove('mobile-open');
      }
    });
  }

  // Smooth scrolling for anchor links
  private setupSmoothScroll(): void {
    const anchors = document.querySelectorAll('a[href^="#"]');
    for (const anchor of anchors) {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }
  }

  // Scroll animations
  private setupAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      }
    }, observerOptions);

    // Observe elements for animation
    const elements = document.querySelectorAll('.product-card, .news-item, .event-item, .insurance-item');
    for (const el of elements) {
      observer.observe(el);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero');
      if (hero) {
        (hero as HTMLElement).style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  // Chatbot functionality
  private setupChatbot(): void {
    const chatbot = document.querySelector('.chatbot');
    if (!chatbot) return;

    let isMinimized = false;

    // Create minimize button
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'chatbot-minimize';
    minimizeBtn.innerHTML = '−';
    minimizeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #666;
    `;

    chatbot.appendChild(minimizeBtn);

    minimizeBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      const content = chatbot.querySelector('.chatbot-content') as HTMLElement;

      if (isMinimized) {
        content.style.display = 'none';
        minimizeBtn.innerHTML = '+';
        (chatbot as HTMLElement).style.padding = '0.5rem';
      } else {
        content.style.display = 'flex';
        minimizeBtn.innerHTML = '−';
        (chatbot as HTMLElement).style.padding = '1rem';
      }
    });

    // Chatbot interaction
    chatbot.addEventListener('click', () => {
      if (!isMinimized) {
        this.showChatbotModal();
      }
    });
  }

  private showChatbotModal(): void {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'chatbot-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 15px;
      max-width: 400px;
      width: 90%;
      text-align: center;
    `;

    modalContent.innerHTML = `
      <h3>¡Hola! Soy Fincobot</h3>
      <p>¿En qué puedo ayudarte hoy?</p>
      <div style="margin: 1rem 0;">
        <button class="quick-option" data-option="credito">Información de créditos</button>
        <button class="quick-option" data-option="ahorro">Productos de ahorro</button>
        <button class="quick-option" data-option="seguros">Seguros</button>
        <button class="quick-option" data-option="contacto">Contacto</button>
      </div>
      <button class="close-modal" style="background: #1e3466; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;">Cerrar</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Quick option buttons
    const quickOptions = modalContent.querySelectorAll('.quick-option');
    for (const btn of quickOptions) {
      (btn as HTMLElement).style.cssText = `
        display: block;
        width: 100%;
        margin: 0.5rem 0;
        padding: 0.75rem;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      `;

      btn.addEventListener('click', (e) => {
        const option = (e.target as HTMLElement).dataset.option;
        this.handleChatbotOption(option || '');
        document.body.removeChild(modal);
      });

      btn.addEventListener('mouseenter', () => {
        (btn as HTMLElement).style.backgroundColor = '#e9ecef';
      });

      btn.addEventListener('mouseleave', () => {
        (btn as HTMLElement).style.backgroundColor = '#f8f9fa';
      });
    }

    // Close modal
    modalContent.querySelector('.close-modal')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  private handleChatbotOption(option: string): void {
    const responses = {
      credito: 'Nuestros créditos tienen tasas desde 1.26% N.M.V. ¿Te gustaría simular tu crédito?',
      ahorro: 'Tenemos CDAT, Fincoahorro, Ahorratón y más productos. ¿Cuál te interesa?',
      seguros: 'Ofrecemos seguros de vida, hogar, vehículos y planes exequiales.',
      contacto: 'Puedes llamarnos al (601) 307 8330 o visitarnos en nuestras oficinas.'
    };

    alert(responses[option as keyof typeof responses] || 'Gracias por tu consulta. Un asesor te contactará pronto.');
  }

  // Card hover effects
  private setupCardHovers(): void {
    const cards = document.querySelectorAll('.product-card');
    for (const card of cards) {
      const cardElement = card as HTMLElement;

      card.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateY(0) scale(1)';
      });

      card.addEventListener('click', () => {
        this.handleCardClick(cardElement);
      });
    }
  }

  private handleCardClick(card: HTMLElement): void {
    const cardTitle = card.querySelector('h3')?.textContent || '';

    // Create a simple modal for card details
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 15px;
      max-width: 500px;
      width: 90%;
      text-align: center;
    `;

    content.innerHTML = `
      <h2 style="color: #1e3466; margin-bottom: 1rem;">${cardTitle}</h2>
      <p style="margin-bottom: 1.5rem;">Descubre más sobre este producto y cómo puede ayudarte a alcanzar tus metas financieras.</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn-primary" style="background: #ddc142; color: #1e3466; border: none; padding: 0.75rem 1.5rem; border-radius: 20px; cursor: pointer;">Más información</button>
        <button class="btn-secondary" style="background: #1e3466; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 20px; cursor: pointer;">Cerrar</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    content.querySelector('.btn-secondary')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    content.querySelector('.btn-primary')?.addEventListener('click', () => {
      alert(`Redirigiendo a más información sobre ${cardTitle}...`);
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // Form validation (if any forms are added)
  private setupFormValidation(): void {
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.validateForm(form as HTMLFormElement);
      });
    }
  }

  private validateForm(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    for (const input of inputs) {
      const inputElement = input as HTMLInputElement;
      if (!inputElement.value.trim()) {
        isValid = false;
        inputElement.style.borderColor = '#dc3545';
      } else {
        inputElement.style.borderColor = '#28a745';
      }
    }

    if (isValid) {
      alert('Formulario enviado correctamente. Nos contactaremos contigo pronto.');
      form.reset();
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
}

// Search functionality
function setupSearch(): void {
  const searchBtn = document.querySelector('.search-btn');
  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const searchTerm = prompt('¿Qué estás buscando?');
    if (searchTerm) {
      // Simulate search
      alert(`Buscando: "${searchTerm}". Esta funcionalidad se integrará con el sistema de búsqueda.`);
    }
  });
}

// Loading animation
function showLoadingAnimation(): void {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1e3466;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: opacity 0.5s ease;
  `;

  loader.innerHTML = `
    <div style="text-align: center; color: white;">
      <div style="width: 50px; height: 50px; border: 3px solid #ddc142; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
      <p>Cargando Fincomercio...</p>
    </div>
  `;

  // Add spinning animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(loader);

  // Remove loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(loader)) {
          document.body.removeChild(loader);
        }
      }, 500);
    }, 1000);
  });
}

// Performance monitoring
function setupPerformanceMonitoring(): void {
  // Monitor page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Página cargada en ${Math.round(loadTime)}ms`);

    // Send analytics (simulated)
    if (loadTime > 3000) {
      console.warn('Tiempo de carga lento detectado');
    }
  });

  // Monitor scroll performance
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = performance.now();
    if (now - lastScrollTime > 16) { // 60fps threshold
      console.log('Scroll performance optimal');
    }
    lastScrollTime = now;
  }, { passive: true });
}

// Error handling
function setupErrorHandling(): void {
  window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.error);
    // In production, send to error tracking service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejection no manejada:', e.reason);
    e.preventDefault();
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  showLoadingAnimation();
  setupErrorHandling();
  setupPerformanceMonitoring();
  setupSearch();

  // Initialize main app
  new FincomercioApp();

  console.log('Fincomercio clone loaded successfully! 🎉');
});

// Form functionality
function openForm(formId: string): void {
  const form = document.getElementById(formId);
  if (form) {
    form.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeForm(formId: string): void {
  const form = document.getElementById(formId);
  if (form) {
    form.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function submitCreditForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  // Show loading state
  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Show success message
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡Solicitud enviada exitosamente! Nos contactaremos contigo pronto.';
    form.insertBefore(message, form.firstChild);

    // Reset form
    form.reset();
    submitBtn.textContent = originalText || 'Enviar solicitud';
    submitBtn.disabled = false;

    // Close form after 3 seconds
    setTimeout(() => {
      closeForm('credit-form');
      message.remove();
    }, 3000);
  }, 2000);
}

function submitSavingsForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Procesando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡Cuenta de ahorro creada exitosamente! Recibirás un correo con los detalles.';
    form.insertBefore(message, form.firstChild);

    form.reset();
    submitBtn.textContent = originalText || 'Abrir cuenta';
    submitBtn.disabled = false;

    setTimeout(() => {
      closeForm('savings-form');
      message.remove();
    }, 3000);
  }, 2000);
}

function submitContactForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡Mensaje enviado exitosamente! Te responderemos pronto.';
    form.insertBefore(message, form.firstChild);

    form.reset();
    submitBtn.textContent = originalText || 'Enviar mensaje';
    submitBtn.disabled = false;

    setTimeout(() => {
      closeForm('contact-form');
      message.remove();
    }, 3000);
  }, 2000);
}

function submitInsuranceForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Procesando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡Cotización solicitada! Recibirás la información en tu correo.';
    form.insertBefore(message, form.firstChild);

    form.reset();
    submitBtn.textContent = originalText || 'Solicitar cotización';
    submitBtn.disabled = false;

    setTimeout(() => {
      closeForm('insurance-form');
      message.remove();
    }, 3000);
  }, 2000);
}

function submitCdatForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Procesando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡CDAT creado exitosamente! Te enviaremos la información de tu inversión.';
    form.insertBefore(message, form.firstChild);

    form.reset();
    submitBtn.textContent = originalText || 'Abrir CDAT';
    submitBtn.disabled = false;

    setTimeout(() => {
      closeForm('cdat-form');
      message.remove();
    }, 3000);
  }, 2000);
}

function submitStoreForm(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Verificando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = '¡Acceso concedido! Serás redirigido a la tienda virtual.';
    form.insertBefore(message, form.firstChild);

    form.reset();
    submitBtn.textContent = originalText || 'Acceder a la tienda';
    submitBtn.disabled = false;

    setTimeout(() => {
      closeForm('store-form');
      message.remove();
      alert('Redirigiendo a la tienda virtual...');
    }, 3000);
  }, 2000);
}

function openInsuranceForm(type: string): void {
  openForm('insurance-form');
  const typeSelect = document.getElementById('insuranceType') as HTMLSelectElement;
  const vehicleInfo = document.getElementById('vehicleInfo') as HTMLElement;

  if (typeSelect) {
    typeSelect.value = type;

    // Show vehicle info if auto insurance
    if (type === 'auto' && vehicleInfo) {
      vehicleInfo.style.display = 'block';
      const vehicleYear = document.getElementById('vehicleYear') as HTMLInputElement;
      if (vehicleYear) {
        vehicleYear.required = true;
      }
    } else if (vehicleInfo) {
      vehicleInfo.style.display = 'none';
      const vehicleYear = document.getElementById('vehicleYear') as HTMLInputElement;
      if (vehicleYear) {
        vehicleYear.required = false;
      }
    }
  }
}

function registerEvent(eventType: string): void {
  const eventNames = {
    vivienda: 'Feria de Vivienda',
    finanzas: 'Conferencia de Educación Financiera',
    salud: 'Jornada de Salud y Bienestar',
    navidad: 'Festival de Navidad'
  };

  const eventName = eventNames[eventType as keyof typeof eventNames] || eventType;

  // Show confirmation
  const confirmed = confirm(`¿Deseas registrarte para el evento "${eventName}"?`);

  if (confirmed) {
    // Simulate registration
    alert(`¡Te has registrado exitosamente para "${eventName}"! Recibirás más información por correo.`);
  }
}

function showNewsModal(newsType: string): void {
  const newsData = {
    horarios: {
      title: 'Nuevos Horarios de Atención',
      content: 'A partir del lunes 21 de julio, nuestras oficinas tendrán nuevos horarios:\n\n• Lunes a Viernes: 8:00 AM - 6:00 PM\n• Sábados: 8:00 AM - 2:00 PM\n• Domingos y festivos: Cerrado\n\nEsto nos permitirá brindarte un mejor servicio.'
    },
    guitarra: {
      title: 'Curso de Guitarra Gratuito',
      content: 'Únete a nuestros cursos de guitarra gratuitos para asociados:\n\n• Clases todos los sábados\n• Horario: 2:00 PM - 4:00 PM\n• Nivel: Principiantes\n• Incluye: Guitarra prestada\n\nCupos limitados. ¡Inscríbete ya!'
    },
    baile: {
      title: 'Cursos de Baile para Pensionados',
      content: 'Actividades diseñadas especialmente para pensionados:\n\n• Bailes de salón\n• Danza terapia\n• Ejercicios de coordinación\n• Ambiente social agradable\n\n¡Mantente activo y saludable!'
    },
    padre: {
      title: 'Celebración Mes del Padre',
      content: 'Participa en nuestro concurso del mes del padre:\n\n• Premio principal: TV 50 pulgadas\n• Premios adicionales para 50 ganadores\n• Solo para asociados activos\n• Participa hasta el 30 de junio\n\n¡No te pierdas esta oportunidad!'
    }
  };

  const data = newsData[newsType as keyof typeof newsData];
  if (data) {
    alert(`${data.title}\n\n${data.content}`);
  }
}

// Update insurance type selector
function setupInsuranceTypeSelector(): void {
  const insuranceType = document.getElementById('insuranceType') as HTMLSelectElement;
  const vehicleInfo = document.getElementById('vehicleInfo') as HTMLElement;

  if (insuranceType && vehicleInfo) {
    insuranceType.addEventListener('change', () => {
      const vehicleYear = document.getElementById('vehicleYear') as HTMLInputElement;

      if (insuranceType.value === 'auto') {
        vehicleInfo.style.display = 'block';
        if (vehicleYear) vehicleYear.required = true;
      } else {
        vehicleInfo.style.display = 'none';
        if (vehicleYear) vehicleYear.required = false;
      }
    });
  }
}

// Close forms when clicking outside
function setupFormClosing(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('form-modal')) {
      const formId = target.id;
      closeForm(formId);
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeForm = document.querySelector('.form-modal.active');
      if (activeForm) {
        closeForm(activeForm.id);
      }
    }
  });
}

// Make functions global for onclick handlers
declare global {
  interface Window {
    openForm: typeof openForm;
    closeForm: typeof closeForm;
    submitCreditForm: typeof submitCreditForm;
    submitSavingsForm: typeof submitSavingsForm;
    submitContactForm: typeof submitContactForm;
    submitInsuranceForm: typeof submitInsuranceForm;
    submitCdatForm: typeof submitCdatForm;
    submitStoreForm: typeof submitStoreForm;
    openInsuranceForm: typeof openInsuranceForm;
    registerEvent: typeof registerEvent;
    showNewsModal: typeof showNewsModal;
  }
}

window.openForm = openForm;
window.closeForm = closeForm;
window.submitCreditForm = submitCreditForm;
window.submitSavingsForm = submitSavingsForm;
window.submitContactForm = submitContactForm;
window.submitInsuranceForm = submitInsuranceForm;
window.submitCdatForm = submitCdatForm;
window.submitStoreForm = submitStoreForm;
window.openInsuranceForm = openInsuranceForm;
window.registerEvent = registerEvent;
window.showNewsModal = showNewsModal;

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupInsuranceTypeSelector();
  setupFormClosing();
});

// Export for potential module usage
export { FincomercioApp };
