/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔧 TEXT UTILITIES V8.1 - Naprawy uciętych zdań i Meta Description
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TextUtils {
    /**
     * Obetnij tekst do pełnego zdania przed limitem
     * @param {string} text - Tekst do obcięcia
     * @param {number} maxLength - Maksymalna długość (domyślnie 3900)
     * @param {number} minThreshold - Minimalna długość jako % maxLength (domyślnie 0.8)
     * @returns {string} - Tekst zakończony pełnym zdaniem
     */
    static truncateToCompleteSentence(text, maxLength = 3900, minThreshold = 0.8) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        
        // Obetnij do maxLength
        const cutText = text.substring(0, maxLength);
        
        // Znajdź ostatnie zakończenie zdania
        const sentenceEndings = [
            cutText.lastIndexOf('.'),
            cutText.lastIndexOf('!'),
            cutText.lastIndexOf('?')
        ];
        
        const lastSentenceEnd = Math.max(...sentenceEndings);
        
        // Jeśli znaleziono zakończenie zdania i jest powyżej minThreshold
        if (lastSentenceEnd > maxLength * minThreshold) {
            return text.substring(0, lastSentenceEnd + 1).trim();
        }
        
        // Fallback: obetnij na ostatnim słowie i dodaj kropkę
        const lastSpace = cutText.lastIndexOf(' ');
        if (lastSpace > 0) {
            return text.substring(0, lastSpace).trim() + '.';
        }
        
        // Ostateczny fallback
        return cutText.trim() + '.';
    }
    
    /**
     * Optymalizuj Meta Description do 150-157 znaków
     * @param {string} text - Tekst Meta Description
     * @param {number} maxLength - Maksymalna długość (domyślnie 157)
     * @returns {string} - Zoptymalizowany Meta Description
     */
    static optimizeMetaDescription(text, maxLength = 157) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        // Obetnij do maxLength - 3 (miejsce na "...")
        const cutLength = maxLength - 3;
        const cutText = text.substring(0, cutLength);
        
        // Znajdź ostatnią spację (obetnij na słowie)
        const lastSpace = cutText.lastIndexOf(' ');
        
        if (lastSpace > cutLength * 0.8) {
            return text.substring(0, lastSpace).trim() + '...';
        }
        
        // Fallback: po prostu obetnij i dodaj ...
        return cutText.trim() + '...';
    }
    
    /**
     * Usuń frazy "producent nie podaje" i podobne
     * @param {string} text - Tekst do oczyszczenia
     * @returns {string} - Oczyszczony tekst
     */
    static removeUnavailableDataPhrases(text) {
        if (!text) return '';
        
        const phrasesToRemove = [
            /Producent nie podaje[^.]*\./gi,
            /Brak informacji o[^.]*\./gi,
            /Nie podano[^.]*\./gi,
            /Szczegółowe dane nie są dostępne[^.]*\./gi,
            /Szczegółowych wymiarów[^.]*nie podaje[^.]*\./gi
        ];
        
        let cleanedText = text;
        
        phrasesToRemove.forEach(regex => {
            cleanedText = cleanedText.replace(regex, '');
        });
        
        // Usuń podwójne spacje
        cleanedText = cleanedText.replace(/\s{2,}/g, ' ');
        
        // Usuń puste linie
        cleanedText = cleanedText.replace(/\n\s*\n/g, '\n');
        
        return cleanedText.trim();
    }
    
    /**
     * Usuń AI-fluff frazy
     * @param {string} text - Tekst do oczyszczenia
     * @returns {string} - Tekst bez AI-fluff
     */
    static removeAIFluff(text) {
        if (!text) return '';
        
        const fluffPhrases = [
            /redefiniuje pojęcie[^.]*\./gi,
            /jest świadectwem[^.]*\./gi,
            /reprezentuje podejście[^.]*\./gi,
            /zaawansowane centrum[^.]*energetyczne i komunikacyjne/gi,
            /precyzyjnie dobranych elementów/gi,
            /starannie zaprojektowany/gi,
            /przemyślana konstrukcja/gi
        ];
        
        let cleanedText = text;
        
        fluffPhrases.forEach(regex => {
            cleanedText = cleanedText.replace(regex, '');
        });
        
        // Usuń podwójne spacje
        cleanedText = cleanedText.replace(/\s{2,}/g, ' ');
        
        return cleanedText.trim();
    }
    
    /**
     * Dodaj numer katalogowy do tagów SEO
     * @param {string} tags - Istniejące tagi (oddzielone przecinkami)
     * @param {string} productIndex - Numer katalogowy produktu
     * @returns {string} - Tagi z numerem katalogowym
     */
    static addProductIndexToTags(tags, productIndex) {
        if (!tags || !productIndex) return tags;
        
        // Sprawdź czy tags jest stringiem
        if (typeof tags !== 'string') {
            console.warn('⚠️ addProductIndexToTags: tags nie jest stringiem:', typeof tags);
            return tags;
        }
        
        const tagsArray = tags.split(',').map(t => t.trim());
        
        // Sprawdź czy numer już jest w tagach
        const hasIndex = tagsArray.some(tag => 
            tag.toLowerCase().includes(productIndex.toLowerCase())
        );
        
        if (hasIndex) return tags; // Już jest, nie dodawaj
        
        // Dodaj na pozycji 2 (po głównej nazwie)
        const indexWithSpaces = productIndex.replace(/[-_]/g, ' ');
        tagsArray.splice(1, 0, productIndex.toLowerCase());
        tagsArray.splice(2, 0, indexWithSpaces.toLowerCase());
        
        return tagsArray.join(',');
    }
    
    /**
     * Waliduj i napraw HTML
     * @param {string} html - HTML do walidacji
     * @returns {object} - { valid, fixed, errors }
     */
    static validateAndFixHTML(html) {
        if (!html) return { valid: true, fixed: html, errors: [] };
        
        const errors = [];
        let fixed = html;
        
        // Sprawdź niezamknięte tagi
        const openTags = (html.match(/<([a-z]+)[^>]*>/gi) || []).map(tag => 
            tag.match(/<([a-z]+)/i)[1].toLowerCase()
        );
        
        const closeTags = (html.match(/<\/([a-z]+)>/gi) || []).map(tag => 
            tag.match(/<\/([a-z]+)>/i)[1].toLowerCase()
        );
        
        // Znajdź niezamknięte tagi
        const tagCounts = {};
        
        openTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        
        closeTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) - 1;
        });
        
        // Napraw niezamknięte tagi
        Object.entries(tagCounts).forEach(([tag, count]) => {
            if (count > 0) {
                // Brakuje tagów zamykających
                errors.push(`Niezamknięty tag: <${tag}>`);
                for (let i = 0; i < count; i++) {
                    fixed += `</${tag}>`;
                }
            } else if (count < 0) {
                // Za dużo tagów zamykających
                errors.push(`Nadmiarowy tag zamykający: </${tag}>`);
            }
        });
        
        return {
            valid: errors.length === 0,
            fixed: fixed,
            errors: errors
        };
    }
    
    /**
     * Post-processing całego opisu produktu
     * @param {object} description - Obiekt z opisem produktu
     * @param {string} productIndex - Numer katalogowy produktu
     * @returns {object} - Poprawiony opis
     */
    static postProcessDescription(description, productIndex = null) {
        if (!description) return description;
        
        const processed = { ...description };
        
        // Fix 1: Ucięte zdania w długim opisie
        if (processed.longDescription && processed.longDescription.length > 3900) {
            console.log(`⚠️ Długi opis przekracza 3900 znaków (${processed.longDescription.length}), obcinam...`);
            processed.longDescription = this.truncateToCompleteSentence(
                processed.longDescription, 
                3900
            );
            console.log(`✅ Obcięto do ${processed.longDescription.length} znaków`);
        }
        
        // Fix 2: Meta Description (ZAWSZE optymalizuj do 150-157 znaków)
        if (processed.metaDescription) {
            const originalLength = processed.metaDescription.length;
            
            // Jeśli za długi lub za krótki - optymalizuj
            if (originalLength < 150 || originalLength > 157) {
                console.log(`⚠️ Meta Description długość: ${originalLength} znaków (cel: 150-157), optymalizuję...`);
                processed.metaDescription = this.optimizeMetaDescription(
                    processed.metaDescription, 
                    157
                );
                console.log(`✅ Zoptymalizowano do ${processed.metaDescription.length} znaków`);
            } else {
                console.log(`✅ Meta Description długość OK: ${originalLength} znaków`);
            }
        }
        
        // Fix 3: Usuń "producent nie podaje"
        if (processed.longDescription) {
            const before = processed.longDescription.length;
            processed.longDescription = this.removeUnavailableDataPhrases(
                processed.longDescription
            );
            if (before !== processed.longDescription.length) {
                console.log(`✅ Usunięto frazy "producent nie podaje"`);
            }
        }
        
        // Fix 4: Usuń AI-fluff (opcjonalne - może zbyt agresywne)
        // if (processed.longDescription) {
        //     processed.longDescription = this.removeAIFluff(processed.longDescription);
        // }
        
        // Fix 5: Dodaj numer katalogowy do tagów SEO
        if (processed.seoTags && productIndex && typeof processed.seoTags === 'string') {
            processed.seoTags = this.addProductIndexToTags(
                processed.seoTags, 
                productIndex
            );
            console.log(`✅ Dodano numer katalogowy do tagów SEO`);
        } else if (processed.seoTags && typeof processed.seoTags !== 'string') {
            console.warn(`⚠️ seoTags nie jest stringiem (${typeof processed.seoTags}), pomijam`);
        }
        
        // Fix 6: Waliduj HTML
        const htmlFields = ['bulletPoints', 'longDescription', 'whyWorthIt'];
        htmlFields.forEach(field => {
            if (processed[field]) {
                const validation = this.validateAndFixHTML(processed[field]);
                if (!validation.valid) {
                    console.warn(`⚠️ ${field}: ${validation.errors.join(', ')}`);
                    processed[field] = validation.fixed;
                    console.log(`✅ ${field}: Naprawiono HTML`);
                }
            }
        });
        
        return processed;
    }
}

// Export do window dla globalnego dostępu
if (typeof window !== 'undefined') {
    window.TextUtils = TextUtils;
}

console.log('✅ TextUtils V8.1 loaded');
