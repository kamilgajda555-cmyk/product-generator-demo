/**
 * Notification System V1.0
 * Elegancki system powiadomień toast
 */

class NotificationSystem {
    constructor() {
        this.container = null;
        this.queue = [];
        this.maxVisible = 5;
        this.init();
    }
    
    /**
     * Inicjalizacja systemu
     */
    init() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
        
        this.addStyles();
        console.log('✅ Notification System zainicjalizowany');
    }
    
    /**
     * Dodaj style CSS
     */
    addStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(450px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(450px);
                    opacity: 0;
                }
            }
            
            .notification {
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 320px;
                animation: notificationSlideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-left: 4px solid #3b82f6;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .notification:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            
            .notification.notification-success {
                border-left-color: #10b981;
            }
            
            .notification.notification-error {
                border-left-color: #ef4444;
            }
            
            .notification.notification-warning {
                border-left-color: #f59e0b;
            }
            
            .notification.notification-info {
                border-left-color: #3b82f6;
            }
            
            .notification i {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .notification-success i {
                color: #10b981;
            }
            
            .notification-error i {
                color: #ef4444;
            }
            
            .notification-warning i {
                color: #f59e0b;
            }
            
            .notification-info i {
                color: #3b82f6;
            }
            
            .notification-content {
                flex: 1;
                font-size: 14px;
                color: #1f2937;
                line-height: 1.4;
            }
            
            .notification-content strong {
                font-weight: 600;
                color: #111827;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                opacity: 0.5;
                transition: opacity 0.2s;
                color: #6b7280;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                opacity: 1;
                color: #1f2937;
            }
            
            @media (max-width: 768px) {
                #notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .notification {
                    min-width: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Pokaż powiadomienie
     */
    show(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type, duration);
        
        // Dodaj do kolejki jeśli za dużo widocznych
        const visible = this.container.children.length;
        if (visible >= this.maxVisible) {
            this.queue.push({ message, type, duration });
            return null;
        }
        
        this.container.appendChild(notification);
        
        // Auto-remove po określonym czasie
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }
    
    /**
     * Utwórz element powiadomienia
     */
    createNotification(message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <div class="notification-content">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Click na close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification);
        });
        
        // Click na całe powiadomienie też zamyka
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        return notification;
    }
    
    /**
     * Usuń powiadomienie
     */
    remove(notification) {
        notification.style.animation = 'notificationSlideOut 0.3s ease-out';
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
            
            // Pokaż następne z kolejki
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                this.show(next.message, next.type, next.duration);
            }
        }, 300);
    }
    
    /**
     * Skróty dla różnych typów
     */
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 4500) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }
    
    /**
     * Wyczyść wszystkie powiadomienia
     */
    clearAll() {
        const notifications = this.container.querySelectorAll('.notification');
        notifications.forEach(n => this.remove(n));
        this.queue = [];
    }
    
    /**
     * Powiadomienie z przyciskiem akcji
     */
    showWithAction(message, type, actionText, actionCallback, duration = 0) {
        const notification = this.createNotification(message, type, duration);
        
        // Dodaj przycisk akcji przed close button
        const actionBtn = document.createElement('button');
        actionBtn.className = 'notification-action-btn';
        actionBtn.textContent = actionText;
        actionBtn.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
            margin-left: auto;
        `;
        
        actionBtn.addEventListener('mouseover', () => {
            actionBtn.style.background = '#2563eb';
        });
        
        actionBtn.addEventListener('mouseout', () => {
            actionBtn.style.background = '#3b82f6';
        });
        
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            actionCallback();
            this.remove(notification);
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        notification.insertBefore(actionBtn, closeBtn);
        
        this.container.appendChild(notification);
        return notification;
    }
}

// Globalna instancja
window.notifications = new NotificationSystem();
console.log('✅ Notification System załadowany');
