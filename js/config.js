/**
 * Config Manager V1.0
 * Bezpieczne zarządzanie kluczem API
 */

class Config {
    constructor() {
        this.apiKey = null;
        this.isConfigured = false;
    }
    
    /**
     * Pobierz API key - z localStorage lub prompt użytkownika
     */
    async getApiKey() {
        if (this.apiKey) {
            return this.apiKey;
        }
        
        // Sprawdź localStorage
        const stored = localStorage.getItem('gemini_api_key_encrypted');
        if (stored) {
            try {
                this.apiKey = this.decrypt(stored);
                this.isConfigured = true;
                console.log('✅ API Key załadowany z localStorage');
                return this.apiKey;
            } catch (error) {
                console.error('❌ Błąd odczytywania klucza:', error);
                localStorage.removeItem('gemini_api_key_encrypted');
            }
        }
        
        // Poproś użytkownika o klucz
        return this.promptForApiKey();
    }
    
    /**
     * Wyświetl modal z prośbą o API key
     */
    promptForApiKey() {
        return new Promise((resolve) => {
            const modal = document.getElementById('api-key-modal');
            if (!modal) {
                console.error('❌ Brak elementu #api-key-modal w HTML!');
                alert('Błąd konfiguracji. Sprawdź konsolę (F12).');
                return;
            }
            
            modal.style.display = 'flex';
            
            const saveButton = document.getElementById('save-api-key');
            const input = document.getElementById('api-key-input');
            
            // Focus na input
            setTimeout(() => input.focus(), 100);
            
            // Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveButton.click();
                }
            });
            
            saveButton.onclick = () => {
                const key = input.value.trim();
                
                // Walidacja
                if (!key) {
                    alert('Proszę wpisać klucz API');
                    return;
                }
                
                if (!key.startsWith('AIza')) {
                    alert('Nieprawidłowy format klucza. Klucz Google Gemini zaczyna się od "AIza"');
                    return;
                }
                
                // Zapisz i zamknij
                this.saveApiKey(key);
                modal.style.display = 'none';
                
                console.log('✅ API Key zapisany');
                resolve(key);
            };
        });
    }
    
    /**
     * Zapisz API key do localStorage (zaszyfrowany)
     */
    saveApiKey(key) {
        const encrypted = this.encrypt(key);
        localStorage.setItem('gemini_api_key_encrypted', encrypted);
        this.apiKey = key;
        this.isConfigured = true;
        
        // Wyświetl potwierdzenie
        if (window.notifications) {
            window.notifications.success('Klucz API zapisany pomyślnie');
        }
    }
    
    /**
     * Proste szyfrowanie (base64 + salt)
     * UWAGA: To nie jest bezpieczne szyfrowanie! 
     * Dla prawdziwego bezpieczeństwa użyj backend proxy.
     */
    encrypt(text) {
        const salt = Math.random().toString(36).substring(2, 15);
        const combined = salt + '|' + text;
        return btoa(combined);
    }
    
    /**
     * Deszyfrowanie
     */
    decrypt(encrypted) {
        const decoded = atob(encrypted);
        const parts = decoded.split('|');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data');
        }
        return parts[1];
    }
    
    /**
     * Wyczyść zapisany klucz
     */
    clearApiKey() {
        localStorage.removeItem('gemini_api_key_encrypted');
        this.apiKey = null;
        this.isConfigured = false;
        console.log('🗑️ API Key wyczyszczony');
        
        if (window.notifications) {
            window.notifications.info('Klucz API został usunięty');
        }
    }
    
    /**
     * Sprawdź czy klucz jest skonfigurowany
     */
    hasApiKey() {
        return this.isConfigured || localStorage.getItem('gemini_api_key_encrypted') !== null;
    }
}

// Globalna instancja
window.appConfig = new Config();
console.log('✅ Config Manager załadowany');
