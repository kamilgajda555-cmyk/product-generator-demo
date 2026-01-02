/**
 * Allegro Scraper V1.0
 * Web scraping Allegro.pl dla wzbogacenia danych produktów
 * 
 * FUNKCJE:
 * - scrapAllegro(ean, nazwa) - główna funkcja scraping
 * - parseAllegroSearch(html) - parser wyników wyszukiwania
 * - extractProductData(offerUrl) - wyciąganie szczegółów oferty
 */

class AllegroScraper {
    constructor() {
        this.baseUrl = 'https://allegro.pl';
        this.searchUrl = 'https://allegro.pl/listing';
        this.timeout = 10000; // 10 sekund
        this.maxOffers = 3; // Top 3 oferty
        this.cache = new Map(); // Cache dla już sprawdzonych produktów
        
        console.log('✅ Allegro Scraper V1.0 loaded');
    }

    /**
     * Główna funkcja: scraping Allegro
     */
    async scrapAllegro(ean, nazwa, indeks = '') {
        try {
            // Sprawdź cache
            const cacheKey = ean || nazwa;
            if (this.cache.has(cacheKey)) {
                console.log(`📦 Cache hit dla: ${cacheKey}`);
                return this.cache.get(cacheKey);
            }

            console.log(`🔍 Wyszukuję na Allegro: EAN=${ean}, Nazwa=${nazwa}`);

            // KROK 1: Wyszukaj po EAN (priorytet)
            let searchQuery = ean || nazwa;
            if (!searchQuery) {
                console.warn('⚠️ Brak EAN i nazwy - pomijam Allegro scraping');
                return null;
            }

            // Użyj Genspark crawler tool (ma built-in anti-bot, proxy, JS rendering!)
            const searchUrl = `${this.searchUrl}?string=${encodeURIComponent(searchQuery)}`;
            console.log(`🌐 URL: ${searchUrl}`);

            // UWAGA: Crawler tool z Genspark obsługuje:
            // - JavaScript rendering (Playwright)
            // - Anti-bot bypass (rotacja proxy, user agents)
            // - CAPTCHA handling
            const html = await this.fetchWithCrawler(searchUrl);

            if (!html) {
                console.warn('⚠️ Nie udało się pobrać strony Allegro');
                return null;
            }

            // KROK 2: Parsuj wyniki wyszukiwania
            const offers = this.parseAllegroSearch(html, ean, nazwa);

            if (!offers || offers.length === 0) {
                console.warn('⚠️ Nie znaleziono ofert na Allegro');
                
                // Fallback: spróbuj po nazwie (jeśli szukałeś po EAN)
                if (ean && nazwa) {
                    console.log(`🔄 Fallback: próbuję wyszukać po nazwie "${nazwa}"`);
                    const fallbackUrl = `${this.searchUrl}?string=${encodeURIComponent(nazwa)}`;
                    const fallbackHtml = await this.fetchWithCrawler(fallbackUrl);
                    if (fallbackHtml) {
                        const fallbackOffers = this.parseAllegroSearch(fallbackHtml, ean, nazwa);
                        if (fallbackOffers && fallbackOffers.length > 0) {
                            return this.buildProductData(fallbackOffers, ean, nazwa);
                        }
                    }
                }
                
                return null;
            }

            // KROK 3: Zbuduj dane produktu z top ofert
            const productData = this.buildProductData(offers, ean, nazwa);

            // Zapisz do cache
            this.cache.set(cacheKey, productData);

            return productData;

        } catch (error) {
            console.error('❌ Błąd podczas scrapowania Allegro:', error);
            return null;
        }
    }

    /**
     * Pobierz stronę przez Genspark Crawler Tool
     */
    async fetchWithCrawler(url) {
        try {
            // UWAGA: Ta funkcja zostanie wywołana z app.js przez crawler tool
            // Tutaj tylko placeholder - faktyczne wywołanie będzie w verifyProductByEAN
            console.log(`📡 Pobieram stronę: ${url}`);
            return null; // Zostanie zastąpione w app.js
        } catch (error) {
            console.error('❌ Błąd pobierania strony:', error);
            return null;
        }
    }

    /**
     * Parsuj wyniki wyszukiwania Allegro
     */
    parseAllegroSearch(html, ean, nazwa) {
        try {
            const offers = [];
            
            // STRATEGIA PARSOWANIA:
            // Allegro używa różnych struktur HTML, więc szukamy wielu wzorców
            
            // Pattern 1: Znajdź oferty (divs z data-box-id lub article)
            const offerPatterns = [
                // Nowa struktura Allegro (2024+)
                /<article[^>]*data-analytics-view-custom-target-id="([^"]*)"[^>]*>(.*?)<\/article>/gs,
                // Stara struktura
                /<div[^>]*data-box-id="([^"]*)"[^>]*>(.*?)<\/div>/gs,
                // Fallback: sekcje z linkami do ofert
                /<a[^>]*href="\/oferta\/([^"]*)"[^>]*>(.*?)<\/a>/gs
            ];

            for (const pattern of offerPatterns) {
                const matches = [...html.matchAll(pattern)];
                if (matches.length > 0) {
                    console.log(`✅ Znaleziono ${matches.length} ofert (pattern: ${pattern.source.substring(0, 50)}...)`);
                    
                    for (const match of matches.slice(0, this.maxOffers)) {
                        const offerHtml = match[0];
                        const offer = this.parseOfferCard(offerHtml, ean, nazwa);
                        if (offer) {
                            offers.push(offer);
                        }
                    }
                    
                    break; // Znaleziono oferty, nie próbuj innych wzorców
                }
            }

            console.log(`📊 Wyciągnięto ${offers.length} ofert z Allegro`);
            return offers;

        } catch (error) {
            console.error('❌ Błąd parsowania wyników Allegro:', error);
            return [];
        }
    }

    /**
     * Parsuj pojedynczą kartę oferty
     */
    parseOfferCard(html, ean, nazwa) {
        try {
            const offer = {
                title: '',
                price: '',
                url: '',
                seller: '',
                sold: '',
                parameters: {},
                description: ''
            };

            // Wyciągnij tytuł oferty
            const titlePatterns = [
                /<h2[^>]*>(.*?)<\/h2>/i,
                /data-analytics-view-label="([^"]*)"/i,
                /<title>(.*?)<\/title>/i
            ];
            
            for (const pattern of titlePatterns) {
                const titleMatch = html.match(pattern);
                if (titleMatch) {
                    offer.title = this.cleanText(titleMatch[1]);
                    if (offer.title.length > 10) break;
                }
            }

            // Wyciągnij cenę
            const pricePatterns = [
                /(\d+[\s,]?\d*)[,.](\d{2})\s*zł/i,
                /price[^>]*>[\s\S]*?(\d+[\s,]?\d*)[,.](\d{2})/i
            ];
            
            for (const pattern of pricePatterns) {
                const priceMatch = html.match(pattern);
                if (priceMatch) {
                    offer.price = `${priceMatch[1].replace(/\s/g, '')}.${priceMatch[2]} PLN`;
                    break;
                }
            }

            // Wyciągnij URL oferty
            const urlMatch = html.match(/href="(\/oferta\/[^"]*)"/i);
            if (urlMatch) {
                offer.url = this.baseUrl + urlMatch[1];
            }

            // Wyciągnij liczbę sprzedanych (jeśli dostępna)
            const soldMatch = html.match(/sprzedanych:\s*(\d+)/i) || 
                            html.match(/(\d+)\s*(?:osób\s+)?kupiło/i);
            if (soldMatch) {
                offer.sold = soldMatch[1];
            }

            // Jeśli mamy podstawowe dane, zwróć ofertę
            if (offer.title && offer.title.length > 10) {
                console.log(`✅ Oferta: ${offer.title.substring(0, 60)}... | ${offer.price}`);
                return offer;
            }

            return null;

        } catch (error) {
            console.error('❌ Błąd parsowania karty oferty:', error);
            return null;
        }
    }

    /**
     * Zbuduj dane produktu z top ofert
     */
    buildProductData(offers, ean, nazwa) {
        if (!offers || offers.length === 0) return null;

        try {
            // Top oferta (najbardziej relevantna)
            const topOffer = offers[0];

            // Wyciągnij markę z tytułu
            const brand = this.extractBrand(topOffer.title);

            // Wyciągnij słowa kluczowe z wszystkich tytułów
            const keywords = this.extractKeywords(offers.map(o => o.title));

            // Zbuduj fragmenty opisów (z tytułów ofert)
            const descriptions = offers
                .map(o => o.title)
                .filter(t => t && t.length > 20)
                .slice(0, 3)
                .map(t => `"${t}"`);

            const productData = {
                source: 'Allegro',
                ean: ean || '',
                name: topOffer.title || nazwa,
                brand: brand,
                category: this.extractCategory(topOffer.title),
                price: topOffer.price || '',
                sold: topOffer.sold || '',
                url: topOffer.url || '',
                keywords: keywords,
                descriptions: descriptions,
                offersCount: offers.length,
                topOffers: offers.slice(0, 3).map(o => ({
                    title: o.title,
                    price: o.price,
                    sold: o.sold
                }))
            };

            console.log('✅ Dane produktu z Allegro:', {
                name: productData.name.substring(0, 60) + '...',
                brand: productData.brand,
                keywords: productData.keywords.slice(0, 5).join(', '),
                offersCount: productData.offersCount
            });

            return productData;

        } catch (error) {
            console.error('❌ Błąd budowania danych produktu:', error);
            return null;
        }
    }

    /**
     * Wyciągnij markę z tytułu
     */
    extractBrand(title) {
        if (!title) return '';

        // Lista popularnych marek narzędzi/sprzętu
        const knownBrands = [
            'HOEGERT', 'YATO', 'MAKITA', 'BOSCH', 'DEWALT', 'STANLEY',
            'MILWAUKEE', 'HITACHI', 'BLACK+DECKER', 'EINHELL', 'RYOBI',
            'FESTOOL', 'METABO', 'HILTI', 'KRAFTOOL', 'GEDORE', 'KNIPEX',
            'WERA', 'WIHA', 'BETA', 'NEO', 'GRAPHITE', 'TOPEX', 'VOREL'
        ];

        const titleUpper = title.toUpperCase();
        for (const brand of knownBrands) {
            if (titleUpper.includes(brand)) {
                return brand;
            }
        }

        // Fallback: pierwsze słowo z wielką literą
        const firstWord = title.split(/\s+/)[0];
        if (firstWord && /^[A-Z]/.test(firstWord)) {
            return firstWord.toUpperCase();
        }

        return '';
    }

    /**
     * Wyciągnij kategorię z tytułu (proste heurystyki)
     */
    extractCategory(title) {
        if (!title) return '';

        const titleLower = title.toLowerCase();
        const categories = {
            'Zestawy narzędzi': ['zestaw', 'komplet', 'walizka', 'skrzynka'],
            'Narzędzia ręczne': ['klucz', 'śrubokręt', 'młotek', 'pilnik', 'kombinerki'],
            'Narzędzia elektryczne': ['wiertarka', 'szlifierka', 'piła', 'frezarka'],
            'BHP': ['kask', 'rękawice', 'okulary', 'nakolanniki', 'ochraniacze'],
            'Elektronarzędzia': ['akumulatorowy', 'sieciowy', '18v', '20v']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            for (const keyword of keywords) {
                if (titleLower.includes(keyword)) {
                    return category;
                }
            }
        }

        return 'Narzędzia i sprzęt';
    }

    /**
     * Wyciągnij słowa kluczowe z tytułów
     */
    extractKeywords(titles) {
        if (!titles || titles.length === 0) return [];

        // Połącz wszystkie tytuły
        const allText = titles.join(' ').toLowerCase();

        // Usuń stop words (polskie)
        const stopWords = new Set([
            'i', 'w', 'na', 'z', 'do', 'od', 'dla', 'po', 'ze', 'o', 'a',
            'ale', 'lub', 'oraz', 'to', 'ta', 'ten', 'jest', 'są', 'będzie'
        ]);

        // Wyciągnij słowa (2-20 znaków)
        const words = allText.match(/\b[a-ząćęłńóśźż]{2,20}\b/gi) || [];

        // Zlicz wystąpienia
        const wordCount = new Map();
        for (const word of words) {
            if (!stopWords.has(word)) {
                wordCount.set(word, (wordCount.get(word) || 0) + 1);
            }
        }

        // Sortuj po częstości i zwróć top 10
        const keywords = [...wordCount.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);

        return keywords;
    }

    /**
     * Wyczyść tekst (usuń HTML, nadmiar białych znaków)
     */
    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, '') // Usuń tagi HTML
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ') // Usuń nadmiar białych znaków
            .trim();
    }

    /**
     * Wyczyść cache (opcjonalnie)
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache Allegro wyczyszczony');
    }
}

// Globalna instancja
window.allegroScraper = new AllegroScraper();
console.log('✅ Allegro Scraper initialized');
