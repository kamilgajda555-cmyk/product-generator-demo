/**
 * Optimized Prompt Generator V8.1 HOTFIX v8
 * NAPRAWIA: bulletPoints są puste - Gemini nie generuje
 */

class OptimizedPromptGenerator {
    constructor() {
        this.rules = window.ECOMMERCE_RULES || {};
        console.log('✅ Optimized Prompt Generator V8.1 HOTFIX v8 initialized');
    }

    generatePrompt(product, language = 'pl', style = 'professional', keywordData = null) {
        console.log('🔥 OptimizedPromptGenerator V8.1 v8 - WYMUSZA bulletPoints');
        
        const profile = this.detectLengthProfile(product);
        const profileConfig = this.rules.lengthProfiles?.[profile] || { 
            name: 'standard', 
            minChars: 1200, 
            maxChars: 2200
        };
        
        if (profileConfig.maxChars > 2200) {
            profileConfig.maxChars = 2200;
        }
        
        const productContext = this.buildProductContext(product);
        const keywords = keywordData?.keywords || [];
        const mainKeyword = keywords[0] || product.nazwa || product.name || 'produkt';
        const productIndex = product.indeks || product.sku || '';

        // V8: SILNIEJSZE WYMUSZENIE bulletPoints z PRZYKŁADEM
        return `# E-COMMERCE OPIS

## DANE
${productContext}

## ZADANIE - Zwróć JSON (WSZYSTKIE pola wymagane):

\`\`\`json
{
  "metaTitle": "Nazwa produktu | ${productIndex}",
  "metaDescription": "Opis 150-157 znaków. Sprawdź!",
  "bulletPoints": "<li>Cecha 1</li><li>Cecha 2</li><li>Cecha 3</li>",
  "longDescription": "<p>Akapit 1</p><p>Akapit 2</p>...",
  "whyWorthIt": "Dlaczego warto kupić...",
  "seoTags": "tag1,tag2,tag3,..."
}
\`\`\`

## REGUŁY KRYTYCZNE
⛔ NIE zostawiaj ŻADNEGO pola pustego
⛔ bulletPoints MUSI zawierać 3 <li> (DOKŁADNIE 3 punkty)
⛔ NIE używaj "...", "…", "etc."
⛔ Zakończ pełnym zdaniem z kropką
⛔ Max ${profileConfig.maxChars} znaków
⛔ NIE wymyślaj danych

---

## ⚠️ KRYTYCZNE OSTRZEŻENIE DLA AI
**bulletPoints** jest WYMAGANE i NIE MOŻE BYĆ PUSTE!
Jeśli nie wygenerujesz bulletPoints → JSON będzie ODRZUCONY!

## SZCZEGÓŁOWA SPEC

### **1. metaTitle** (50-60 zn)
Format: "Högert – ${mainKeyword} [Cecha] | ${productIndex}" (50-60 zn)
⚠️ Skróć jeśli nazwa produktu jest długa!
Przykład: "Högert – Zestaw narzędziowy 222 szt. CrV | HT1R444"

### **2. metaDescription** (150-157 zn)
- Keyword: ${mainKeyword}
- 2 konkretne cechy
- CTA: DOKŁADNIE "Sprawdź szczegóły!" (10 znaków)
  - ⚠️ WAŻNE: CTA pojawia się TYLKO RAZ na samym końcu opisu!
  - NIE dodawaj "Sprawdź..." drugi raz - zostanie dodane automatycznie
- **POLICZ znaki przed wysłaniem!**
Przykład (153 zn): "Zestaw HT1R232 z 112 elementami CrV. Grzechotki 72T 1/4" i 1/2" zapewniają precyzję. Walizka metalowa. 25 lat gwarancji. Sprawdź szczegóły!"

### **3. bulletPoints** (DOKŁADNIE 3 pozycje) - WYMAGANE!
⚠️ **TO POLE NIE MOŻE BYĆ PUSTE!**
⚠️ **KRYTYCZNE: Każdy bullet MAKSYMALNIE 50 ZNAKÓW (licząc tekst bez tagów <li></li>)!**

Format HTML: \`<li>Konkretna cecha.</li>\`

❌ ZABRONIONE:
- Ogólniki: "Wysoka jakość", "Profesjonalny"
- Cechy sklepu: "Szybka dostawa 24h", "Łatwy zwrot"
- Długie zdania >50 znaków

✅ DOZWOLONE (z parametrami technicznymi):
- "Izolacja 1000 V - bezpieczna praca z prądem." (48 zn)
- "25 elementów: szczypce, wkrętaki, nasadki." (47 zn)
- "Stal CrV zwiększa wytrzymałość narzędzi." (43 zn)

**PRZYKŁAD (każdy <50 znaków):**
\`\`\`
<li>Certyfikat VDE zapewnia bezpieczeństwo pracy.</li><li>Stal stopowa CrV zwiększa wytrzymałość.</li><li>Zestaw 25 elementów do prac elektrycznych.</li>
\`\`\`

### **4. longDescription** (${profileConfig.minChars}-${profileConfig.maxChars} zn)

⚠️ MAX ${profileConfig.maxChars} ZNAKÓW!
⚠️ ZAKOŃCZ PEŁNYM ZDANIEM (kropka, nie "...")!

Struktura (4 akapity <p>):
1. Intro + główna korzyść (250-350 zn) - użyj "${mainKeyword}"
2. Szczegóły techniczne (350-500 zn)
3. Zastosowanie/użycie (250-350 zn)
4. Podsumowanie + CTA (150-250 zn)

HTML: <p>, <strong>, <ul>, <li>
Max 20 słów/zdanie

### **5. whyWorthIt** (300-500 zn)
2-3 zdania dlaczego warto kupić
NIE używaj "...", zakończ kropką

### **6. seoTags** (8-12 tagów)
Format: tag1, tag2, tag3, ... (⚠️ UWAGA: spacja po każdym przecinku!)
1. Nazwa produktu (lowercase)
2. Nazwa + ${productIndex}
3. ${productIndex.replace(/[-_]/g, ' ')}
4-12. Kategoria, materiał, cechy

Przykład: "zestaw narzędzi, zestaw narzędzi ht1e101, ht1e101, narzędzia izolowane, certyfikat vde, stal crv, klucze izolowane"

---

## LISTA ZAKAZANYCH FRAZ
- "wysoka jakość"
- "zaawansowane technologie"
- "niezawodność"
- "innowacyjny"
- "doskonała obsługa"
- "szybka dostawa"
- "sprawdzone przez klientów"
- "łatwy zwrot"

---

## FINAL CHECKLIST (PRZED WYSŁANIEM!)

Sprawdź KAŻDE pole:
- [ ] metaTitle: 50-60 znaków? ✅
- [ ] metaDescription: 150-157 znaków? ✅
- [ ] **bulletPoints: 3-5 <li> (NIE PUSTE!)?** ✅
- [ ] bulletPoints: cechy PRODUKTU (nie sklepu)? ✅
- [ ] longDescription: ${profileConfig.minChars}-${profileConfig.maxChars} zn? ✅
- [ ] longDescription: kończy się kropką? ✅
- [ ] whyWorthIt: 300-500 zn? ✅
- [ ] seoTags: zawiera "${productIndex}"? ✅
- [ ] Brak "...", "…", "TODO"? ✅
- [ ] Wszystkie dane z kontekstu? ✅

⚠️ JEŚLI bulletPoints JEST PUSTE → NIEPOPRAWNY JSON!

Odpowiedz TYLKO JSON (bez tekstu przed/po).`;
    }

    detectLengthProfile(product) {
        const name = (product.nazwa || product.name || '').toLowerCase();
        const category = (product.kategoria || '').toLowerCase();

        if (name.includes('zestaw') || name.includes('kit') || name.includes('set') ||
            category.includes('zestaw') || category.includes('maszyn')) {
            return 'complex';
        }

        return 'standard';
    }

    buildProductContext(product) {
        const fields = {
            'Nazwa': product.nazwa || product.name,
            'Kategoria': product.kategoria,
            'Indeks': product.indeks || product.sku,
            'EAN': product.ean,
            'Materiał': product.material || product['materiał'],
            'Kolor': product.kolor,
            'Wymiary': this.formatDimensions(product),
            'Waga': product.waga ? `${product.waga} kg` : null,
            'Opis': product.opis,
            'Dodatkowy opis': product['dodatkowy opis'] || product.opisDodatkowy
        };

        const lines = Object.entries(fields)
            .filter(([_, value]) => value)
            .map(([key, value]) => `**${key}:** ${value}`);

        return lines.length > 0 ? lines.join('\n') : `**Nazwa:** ${product.nazwa || product.name || 'Produkt'}`;
    }

    formatDimensions(product) {
        const length = product['długość'] || product.dlugosc;
        const width = product.szerokość || product.szerokosc;
        const height = product.wysokość || product.wysokosc;

        if (length && width && height) {
            return `${length}×${width}×${height} mm`;
        } else if (length && width) {
            return `${length}×${width} mm`;
        } else if (length) {
            return `${length} mm`;
        }

        return null;
    }
}

window.OptimizedPromptGenerator = OptimizedPromptGenerator;
console.log('✅ OptimizedPromptGenerator V8.1 HOTFIX v8 loaded');
