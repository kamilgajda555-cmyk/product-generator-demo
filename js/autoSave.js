/**
 * Auto-Save System V1.0
 * Automatyczne zapisywanie postępów do localStorage
 */

class AutoSave {
    constructor() {
        this.saveInterval = 5000; // 5 sekund
        this.timer = null;
        this.lastSave = null;
    }
    
    /**
     * Uruchom auto-save
     */
    start() {
        if (this.timer) {
            console.warn('⚠️ Auto-save już uruchomiony');
            return;
        }
        
        this.timer = setInterval(() => {
            this.save();
        }, this.saveInterval);
        
        console.log('✅ Auto-save uruchomiony (co', this.saveInterval / 1000, 'sekund)');
    }
    
    /**
     * Zatrzymaj auto-save
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('⏸️ Auto-save zatrzymany');
        }
    }
    
    /**
     * Zapisz aktualny stan aplikacji
     */
    save() {
        try {
            // Pobierz dane z globalnego scope
            const state = {
                productsData: window.productsData || [],
                generatedDescriptions: window.generatedDescriptions || [],
                selectedProducts: Array.from(window.selectedProducts || []),
                columnMapping: window.columnMapping || {},
                timestamp: Date.now(),
                version: '7.1.0'
            };
            
            // Kompresja: usuń zbędne dane
            const compressed = this.compress(state);
            
            // Zapisz do localStorage
            localStorage.setItem('app_state_v2', JSON.stringify(compressed));
            
            this.lastSave = Date.now();
            
            // Pokaż dyskretny wskaźnik
            this.showSaveIndicator();
            
            console.log('💾 Auto-save:', compressed.productsData.length, 'produktów,', 
                        compressed.generatedDescriptions.length, 'opisów');
        } catch (error) {
            console.error('❌ Auto-save error:', error);
            
            // Jeśli przekroczono limit localStorage (5MB), wyczyść stare dane
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ Przekroczono limit localStorage - czyszczenie starych danych');
                this.cleanOldData();
            }
        }
    }
    
    /**
     * Kompresja stanu (usuń duplikaty, zbędne pola)
     */
    compress(state) {
        return {
            productsData: state.productsData.map(p => ({
                indeks: p.indeks,
                nazwa: p.nazwa,
                kategoria: p.kategoria,
                Ean: p.Ean,
                status: p.status
            })),
            generatedDescriptions: state.generatedDescriptions,
            selectedProducts: state.selectedProducts,
            columnMapping: state.columnMapping,
            timestamp: state.timestamp,
            version: state.version
        };
    }
    
    /**
     * Przywróć zapisany stan
     */
    restore() {
        try {
            // Próbuj wersji 2
            let saved = localStorage.getItem('app_state_v2');
            
            // Fallback do starej wersji
            if (!saved) {
                saved = localStorage.getItem('app_state');
            }
            
            if (!saved) {
                console.log('ℹ️ Brak zapisanego stanu');
                return null;
            }
            
            const state = JSON.parse(saved);
            
            // Sprawdź wiek (nie starszy niż 7 dni)
            const age = Date.now() - state.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dni
            
            if (age > maxAge) {
                console.log('⚠️ Zapisany stan jest starszy niż 7 dni - pomijam');
                this.clear();
                return null;
            }
            
            const date = new Date(state.timestamp);
            console.log('✅ Znaleziono zapisany stan z:', date.toLocaleString('pl-PL'));
            console.log('   Produktów:', state.productsData.length);
            console.log('   Wygenerowanych opisów:', state.generatedDescriptions.length);
            
            return state;
        } catch (error) {
            console.error('❌ Błąd przywracania stanu:', error);
            return null;
        }
    }
    
    /**
     * Sprawdź czy istnieje zapisany stan
     */
    hasSavedState() {
        return localStorage.getItem('app_state_v2') !== null || 
               localStorage.getItem('app_state') !== null;
    }
    
    /**
     * Wyczyść zapisany stan
     */
    clear() {
        localStorage.removeItem('app_state');
        localStorage.removeItem('app_state_v2');
        console.log('🗑️ Wyczyszczono zapisany stan');
        
        if (window.notifications) {
            window.notifications.info('Historia pracy wyczyszczona');
        }
    }
    
    /**
     * Wyczyść stare dane aby zwolnić miejsce
     */
    cleanOldData() {
        const keys = Object.keys(localStorage);
        const ageThreshold = 24 * 60 * 60 * 1000; // 24 godziny
        
        keys.forEach(key => {
            if (key.startsWith('app_state_backup_')) {
                const timestamp = parseInt(key.split('_').pop());
                if (Date.now() - timestamp > ageThreshold) {
                    localStorage.removeItem(key);
                    console.log('🗑️ Usunięto stary backup:', key);
                }
            }
        });
    }
    
    /**
     * Pokaż wskaźnik zapisu
     */
    showSaveIndicator() {
        let indicator = document.getElementById('save-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.innerHTML = '<i class="fas fa-check"></i> Zapisano';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                font-weight: 500;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 9999;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                pointer-events: none;
            `;
            document.body.appendChild(indicator);
        }
        
        // Fade in
        indicator.style.opacity = '1';
        
        // Fade out po 2 sekundach
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }
    
    /**
     * Eksportuj stan do pliku JSON
     */
    exportState() {
        try {
            const state = {
                productsData: window.productsData || [],
                generatedDescriptions: window.generatedDescriptions || [],
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `product-generator-backup-${Date.now()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            console.log('💾 Stan wyeksportowany do pliku');
            
            if (window.notifications) {
                window.notifications.success('Backup zapisany jako plik JSON');
            }
        } catch (error) {
            console.error('❌ Błąd eksportu:', error);
            
            if (window.notifications) {
                window.notifications.error('Nie udało się wyeksportować backupu');
            }
        }
    }
}

// Globalna instancja
window.autoSave = new AutoSave();
console.log('✅ Auto-Save System załadowany');
