# 🚀 Generator Opisów Produktów - DEMO ONLINE dla Zespołu

## 📋 Informacje ogólne

**Wersja:** V8.3 AUTO-FIX (Online Demo)  
**Przeznaczenie:** Testy zespołowe przed produkcją  
**Status:** DEMO - wymaga własnego Gemini API Key

---

## 🔑 Wymagania przed użyciem

### **1. Gemini API Key (WYMAGANE)**

Każdy członek zespołu musi mieć własny klucz API:

**Jak uzyskać klucz (1 minuta):**
1. Otwórz: https://aistudio.google.com/app/apikey
2. Zaloguj się kontem Google
3. Kliknij **"Create API Key"**
4. Skopiuj klucz (zaczyna się od `AIza...`)

**Koszt:** Darmowy do 1500 requestów/dzień (~300 produktów)  
**Uwaga:** Nie udostępniaj klucza publicznie!

---

## 🌐 Jak używać DEMO Online?

### **Metoda 1: Bezpośrednio z plików (najprostsza)**

1. **Otwórz `index.html`** w przeglądarce (Chrome, Edge, Firefox)
2. **Kliknij "Ustawienia"** (prawy górny róg)
3. **Wklej swój Gemini API Key**
4. **Kliknij "Zapisz"**
5. **Gotowe!** Możesz generować opisy

---

### **Metoda 2: Hosting online (GitHub Pages / Netlify)**

#### **GitHub Pages (darmowy, publiczny):**

```bash
# 1. Utwórz repozytorium GitHub
gh repo create product-generator-demo --public

# 2. Skopiuj pliki
cp -r product_app_V8_ONLINE_DEMO/* .

# 3. Push do GitHub
git add .
git commit -m "Demo V8.3"
git push

# 4. Włącz GitHub Pages
# Settings → Pages → Source: main branch → Save
```

**Link demo:** `https://[username].github.io/product-generator-demo/`

---

#### **Netlify (darmowy, szybszy):**

```bash
# 1. Zainstaluj Netlify CLI
npm install -g netlify-cli

# 2. Zaloguj się
netlify login

# 3. Deploy
cd product_app_V8_ONLINE_DEMO
netlify deploy --prod

# Netlify wygeneruje link: https://[random-name].netlify.app/
```

---

### **Metoda 3: Lokalny serwer (dla developerów)**

```bash
# Python 3
cd product_app_V8_ONLINE_DEMO
python -m http.server 8000

# Node.js
npx serve product_app_V8_ONLINE_DEMO

# Otwórz: http://localhost:8000
```

---

## 📝 Instrukcja testowania

### **TEST 1: Podstawowa generacja (5 min)**

1. **Wczytaj CSV testowy:**
   - Przygotuj CSV z 3-5 produktami
   - Kolumny: indeks, nazwa, kategoria, opis, materiał, wymiary

2. **Wygeneruj opisy:**
   - Zaznacz 1 produkt
   - Kliknij "Generuj opisy"
   - Poczekaj ~30 sekund

3. **Sprawdź jakość:**
   - ✅ Meta Description kończy się "Sprawdź szczegóły!"
   - ✅ 3 Kluczowe Cechy są wypełnione
   - ✅ Długi opis 1200-2200 znaków
   - ✅ SEO Tags zawierają indeks produktu

---

### **TEST 2: Różne typy produktów (15 min)**

Przetestuj na:
- ✅ **Zestaw narzędzi** (complex, >100 elementów)
- ✅ **Pojedyncze narzędzie** (simple, np. młotek)
- ✅ **Odzież** (T-shirt, spodnie)
- ✅ **Akcesoria** (np. latarka)

**Sprawdź:**
- Czy długość opisu dostosowuje się do produktu?
- Czy cechy są konkretne (nie ogólne)?
- Czy Quality Score > 75?

---

### **TEST 3: Edge cases (10 min)**

1. **Produkt bez opisu:**
   - Pozostaw pole "opis" puste
   - Sprawdź czy opis się wygeneruje

2. **Produkt z długą nazwą:**
   - Nazwa >100 znaków
   - Sprawdź czy Meta Title <60 znaków

3. **Produkt po polsku:**
   - Wszystkie dane po polsku
   - Sprawdź czy nie ma anglicyzmów

---

## 🐛 Typowe problemy i rozwiązania

### **Problem 1: "BRAK KLUCZA API GEMINI"**
**Rozwiązanie:**
1. Ustawienia → Wklej API Key → Zapisz
2. Odśwież stronę (F5)

---

### **Problem 2: "Meta Description kończy się '...'"**
**Rozwiązanie:**
- To jest błąd! V8.3 powinien to naprawić automatycznie
- Sprawdź konsolę (F12): musi być "V8.3 AUTO-FIX loaded"
- Jeśli nie ma → wyczyść cache (Ctrl+Shift+R)

---

### **Problem 3: "Puste 3 Kluczowe Cechy"**
**Rozwiązanie:**
- Sprawdź czy CSV ma kolumny: materiał, wymiary, funkcje
- System generuje cechy z danych - jeśli brak danych, użyje backup

---

### **Problem 4: "Quality Score <70"**
**Rozwiązanie:**
- Dodaj więcej danych w CSV (materiał, wymiary, funkcje)
- Sprawdź czy opis produktu w CSV ma >100 znaków

---

## 📊 Feedback dla zespołu

**Po testach wypełnij krótki feedback:**

1. **Co działa dobrze?** (np. szybkość, jakość opisów)
2. **Co wymaga poprawy?** (np. długość, cechy)
3. **Jakie błędy znalazłeś?** (np. urwane zdania, błędne dane)
4. **Czy użyłbyś tego w produkcji?** (TAK/NIE + dlaczego)

**Wyślij feedback na:** [email kontaktowy] lub Slack #product-generator

---

## 🔒 Bezpieczeństwo

**❌ NIE UDOSTĘPNIAJ:**
- Gemini API Key (prywatny!)
- CSV z danymi produkcyjnymi (RODO!)

**✅ MOŻESZ UDOSTĘPNIĆ:**
- Link do demo online
- Screenshoty (bez danych wrażliwych)
- Feedback i sugestie

---

## 📦 Zawartość demo

```
product_app_V8_ONLINE_DEMO/
├── index.html                     (Główna aplikacja)
├── js/
│   ├── app.js                    (Logika + AUTO-FIX v8.3)
│   ├── optimizedPromptGenerator.js
│   ├── textUtils.js
│   ├── configManager.js
│   └── ecommerce_content_rules_v706.js
├── css/
│   └── style.css
└── INSTRUKCJA_DEMO_ONLINE.md     (Ten plik)
```

---

## 🚀 Następne kroki

**Po testach zespołowych:**
1. Zbierz feedback
2. Napraw znalezione błędy
3. Wdróż w produkcji (z własnym backend)
4. Monitoruj jakość opisów

---

## 📞 Wsparcie

**Pytania techniczne:** [Twój kontakt]  
**Problemy z API Key:** https://aistudio.google.com/app/apikey  
**Dokumentacja:** README_V8.3_FINAL.md w AI Drive

---

**Wersja:** V8.3 AUTO-FIX (Online Demo)  
**Data:** 2 stycznia 2026  
**Status:** READY FOR TEAM TESTING ✅

**Powodzenia w testach!** 🚀
