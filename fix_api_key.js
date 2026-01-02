// Pomocnicza funkcja do pobierania API Key
async function getGeminiApiKey() {
    // Metoda 1: Przez window.appConfig
    if (window.appConfig && typeof window.appConfig.getApiKey === 'function') {
        try {
            const key = await window.appConfig.getApiKey();
            if (key) {
                console.log('✅ API Key z appConfig:', key.substring(0, 10) + '...');
                return key;
            }
        } catch (error) {
            console.warn('⚠️ Nie udało się pobrać z appConfig:', error.message);
        }
    }
    
    // Metoda 2: Bezpośrednio z localStorage
    const stored = localStorage.getItem('gemini_api_key_encrypted');
    if (stored) {
        try {
            // Spróbuj deszyfrowac (base64)
            const key = atob(stored);
            console.log('✅ API Key z localStorage (base64):', key.substring(0, 10) + '...');
            return key;
        } catch (e) {
            // Jeśli nie base64, użyj raw
            console.log('✅ API Key z localStorage (raw):', stored.substring(0, 10) + '...');
            return stored;
        }
    }
    
    console.error('❌ API Key nie znaleziony!');
    console.log('- window.appConfig:', window.appConfig);
    console.log('- localStorage key:', stored);
    return null;
}

console.log('✅ Helper function getGeminiApiKey() loaded');
