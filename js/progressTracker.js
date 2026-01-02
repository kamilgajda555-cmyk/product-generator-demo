/**
 * Progress Tracker V1.0
 * Zaawansowany system śledzenia postępów z ETA
 */

class ProgressTracker {
    constructor() {
        this.total = 0;
        this.completed = 0;
        this.failed = 0;
        this.startTime = null;
        this.progressElement = null;
        this.updateInterval = null;
    }
    
    /**
     * Inicjalizuj tracker dla nowej sesji generowania
     */
    init(total) {
        this.total = total;
        this.completed = 0;
        this.failed = 0;
        this.startTime = Date.now();
        
        this.createProgressUI();
        this.update();
        
        // Auto-update co sekundę dla odliczania czasu
        this.updateInterval = setInterval(() => {
            this.update();
        }, 1000);
        
        console.log('📊 Progress Tracker zainicjalizowany:', total, 'zadań');
    }
    
    /**
     * Stwórz interfejs użytkownika
     */
    createProgressUI() {
        // Usuń stary jeśli istnieje
        const existing = document.getElementById('advanced-progress');
        if (existing) existing.remove();
        
        const container = document.createElement('div');
        container.id = 'advanced-progress';
        container.innerHTML = `
            <div class="progress-header">
                <span class="progress-title">
                    <i class="fas fa-sync fa-spin"></i> Generowanie opisów...
                </span>
                <span class="progress-stats">
                    <span id="progress-current">0</span>/<span id="progress-total">${this.total}</span>
                </span>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="progress-bar-fill" style="width: 0%"></div>
                <span class="progress-percentage" id="progress-percentage">0%</span>
            </div>
            
            <div class="progress-details">
                <div class="detail-item">
                    <i class="fas fa-check-circle" style="color: #10b981;"></i>
                    <span>Ukończone: <strong id="progress-completed">0</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-times-circle" style="color: #ef4444;"></i>
                    <span>Błędy: <strong id="progress-failed">0</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Czas: <strong id="progress-elapsed">0:00</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hourglass-half"></i>
                    <span>Pozostało: <strong id="progress-eta">obliczam...</strong></span>
                </div>
            </div>
            
            <div class="progress-actions">
                <button class="btn-mini btn-danger" onclick="window.progressTracker.cancel()" title="Anuluj generowanie">
                    <i class="fas fa-stop"></i> Anuluj
                </button>
            </div>
        `;
        
        // Style inline
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 20px;
            width: 420px;
            max-width: 90vw;
            z-index: 10000;
            animation: slideInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(container);
        this.progressElement = container;
        
        // Dodaj style dla komponentów
        this.addStyles();
    }
    
    /**
     * Dodaj style CSS
     */
    addStyles() {
        if (document.getElementById('progress-tracker-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'progress-tracker-styles';
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            #advanced-progress .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            #advanced-progress .progress-title {
                font-weight: 600;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            #advanced-progress .progress-stats {
                font-size: 18px;
                font-weight: 700;
                color: #3b82f6;
            }
            
            #advanced-progress .progress-bar-container {
                position: relative;
                background: #e5e7eb;
                height: 32px;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 15px;
            }
            
            #advanced-progress .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #2563eb);
                transition: width 0.3s ease;
                border-radius: 6px;
            }
            
            #advanced-progress .progress-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-weight: 700;
                color: #1f2937;
                font-size: 14px;
            }
            
            #advanced-progress .progress-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 15px;
            }
            
            #advanced-progress .detail-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #4b5563;
            }
            
            #advanced-progress .detail-item i {
                font-size: 16px;
            }
            
            #advanced-progress .progress-actions {
                text-align: center;
            }
            
            #advanced-progress .btn-mini {
                padding: 6px 12px;
                font-size: 13px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            #advanced-progress .btn-danger {
                background: #ef4444;
                color: white;
            }
            
            #advanced-progress .btn-danger:hover {
                background: #dc2626;
            }
            
            #advanced-progress .progress-complete {
                text-align: center;
                padding: 20px;
            }
            
            #advanced-progress .progress-complete h3 {
                margin: 15px 0 10px;
                color: #1f2937;
            }
            
            #advanced-progress .progress-complete p {
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                #advanced-progress {
                    width: calc(100vw - 20px) !important;
                    left: 10px !important;
                    right: 10px !important;
                    bottom: 10px !important;
                }
                
                #advanced-progress .progress-details {
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Aktualizuj wyświetlane wartości
     */
    update() {
        if (!this.progressElement) return;
        
        const percentage = Math.round((this.completed / this.total) * 100);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Oblicz ETA
        let eta = 'obliczam...';
        if (this.completed > 2) { // Minimum 3 próbki dla dokładności
            const avgTime = elapsed / this.completed;
            const remaining = (this.total - this.completed) * avgTime;
            eta = this.formatTime(Math.ceil(remaining));
        }
        
        // Aktualizuj elementy UI
        const elements = {
            'progress-current': this.completed,
            'progress-completed': this.completed - this.failed,
            'progress-failed': this.failed,
            'progress-percentage': percentage + '%',
            'progress-elapsed': this.formatTime(elapsed),
            'progress-eta': eta
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
        
        // Aktualizuj pasek postępu
        const fill = document.getElementById('progress-bar-fill');
        if (fill) fill.style.width = percentage + '%';
    }
    
    /**
     * Zwiększ licznik (wywołaj po zakończeniu zadania)
     */
    increment(success = true) {
        this.completed++;
        if (!success) this.failed++;
        
        this.update();
        
        // Jeśli wszystko ukończone
        if (this.completed >= this.total) {
            this.complete();
        }
    }
    
    /**
     * Generowanie ukończone
     */
    complete() {
        // Zatrzymaj auto-update
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const successCount = this.completed - this.failed;
        const successRate = Math.round((successCount / this.total) * 100);
        
        setTimeout(() => {
            if (this.progressElement) {
                this.progressElement.innerHTML = `
                    <div class="progress-complete">
                        <i class="fas fa-check-circle" style="color: #10b981; font-size: 56px;"></i>
                        <h3>✅ Generowanie ukończone!</h3>
                        <p>
                            <strong>${successCount}</strong> z <strong>${this.total}</strong> opisów wygenerowanych pomyślnie<br>
                            Wskaźnik sukcesu: <strong>${successRate}%</strong><br>
                            Całkowity czas: <strong>${this.formatTime(elapsed)}</strong>
                            ${this.failed > 0 ? `<br><span style="color: #ef4444;">Błędy: <strong>${this.failed}</strong></span>` : ''}
                        </p>
                        <button class="btn btn-primary" onclick="window.progressTracker.remove()">
                            <i class="fas fa-times"></i> Zamknij
                        </button>
                    </div>
                `;
            }
        }, 500);
        
        console.log('✅ Generowanie ukończone:', successCount, '/', this.total, 'sukces:', successRate + '%');
        
        // Powiadomienie
        if (window.notifications) {
            window.notifications.success(
                `Wygenerowano ${successCount} z ${this.total} opisów (${successRate}%)`,
                5000
            );
        }
    }
    
    /**
     * Anuluj generowanie
     */
    cancel() {
        if (confirm('Czy na pewno chcesz anulować generowanie?')) {
            window.cancelGeneration = true;
            this.remove();
            
            console.log('⏹️ Generowanie anulowane przez użytkownika');
            
            if (window.notifications) {
                window.notifications.warning('Generowanie anulowane');
            }
        }
    }
    
    /**
     * Usuń UI
     */
    remove() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.progressElement) {
            this.progressElement.style.animation = 'slideOutDown 0.3s ease-out';
            setTimeout(() => {
                if (this.progressElement) {
                    this.progressElement.remove();
                    this.progressElement = null;
                }
            }, 300);
        }
        
        // Reset
        this.total = 0;
        this.completed = 0;
        this.failed = 0;
        this.startTime = null;
    }
    
    /**
     * Formatuj czas (sekundy -> MM:SS)
     */
    formatTime(seconds) {
        if (seconds < 0 || isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Dodaj animację slideOut
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Globalna instancja
window.progressTracker = new ProgressTracker();
console.log('✅ Progress Tracker załadowany');
