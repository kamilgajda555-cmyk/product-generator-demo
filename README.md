# 🚀 Generator Opisów Produktów - DEMO dla Zespołu

![Version](https://img.shields.io/badge/version-8.3_AUTO--FIX-blue)
![Status](https://img.shields.io/badge/status-DEMO-orange)
![License](https://img.shields.io/badge/license-Internal-red)

**Automatyczne generowanie opisów produktów SEO z wykorzystaniem Gemini 2.5 Pro AI**

---

## 🎯 Co to jest?

To **wersja demonstracyjna** generatora opisów produktów dla GTV Poland. Aplikacja używa **Gemini 2.5 Pro AI** do automatycznego tworzenia:

- ✅ **Meta Title** (50-60 znaków)
- ✅ **Meta Description** (150-157 znaków) z poprawnym CTA
- ✅ **3 Kluczowe Cechy** (konkretne dane produktu)
- ✅ **Długi opis SEO** (1200-2200 znaków)
- ✅ **Tagi SEO** (8-12 słów kluczowych)
- ✅ **Quality Score** (ocena jakości 0-100)

---

## 🔑 Wymagania

### **Gemini API Key (OBOWIĄZKOWE)**

Każdy tester musi mieć własny klucz API:

1. Otwórz: https://aistudio.google.com/app/apikey
2. Zaloguj się kontem Google
3. Kliknij **"Create API Key"**
4. Skopiuj klucz (zaczyna się od `AIza...`)

**Koszt:** Darmowy do 1500 requestów/dzień (~300 produktów/dzień)

---

## 🚀 Jak uruchomić?

### **Metoda 1: Bezpośrednio z plików (najprostsza)**

```bash
# 1. Pobierz repozytorium
git clone [URL_REPO]
cd product_app_V8_ONLINE_DEMO

# 2. Otwórz w przeglądarce
# Kliknij dwukrotnie na index.html
# LUB przeciągnij index.html do przeglądarki

# 3. Wklej API Key
# Ustawienia → Gemini API Key → Zapisz
```

---

### **Metoda 2: GitHub Pages (hosting online)**

```bash
# 1. Fork tego repozytorium

# 2. Włącz GitHub Pages
# Settings → Pages → Source: main branch → Save

# 3. Link demo:
# https://[username].github.io/[repo-name]/
```

---

### **Metoda 3: Netlify (najszybszy hosting)**

```bash
# 1. Zainstaluj Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Netlify wygeneruje link
# https://[random-name].netlify.app/
```

---

### **Metoda 4: Lokalny serwer (dla developerów)**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# Otwórz: http://localhost:8000
```

---

## 📝 Jak używać?

### **KROK 1: Wklej API Key**
1. Kliknij "Ustawienia" (prawy górny róg)
2. Wklej swój Gemini API Key
3. Kliknij "Zapisz"

### **KROK 2: Wczytaj CSV**
1. Kliknij "Wczytaj CSV"
2. Wybierz plik CSV z produktami
3. Lub użyj **DANE_TESTOWE.csv** z tego repo

### **KROK 3: Generuj opisy**
1. Zaznacz 1-3 produkty
2. Kliknij "Generuj opisy"
3. Poczekaj ~30 sekund na produkt

### **KROK 4: Sprawdź jakość**
- ✅ Meta Description kończy się "Sprawdź szczegóły!"
- ✅ 3 Kluczowe Cechy są wypełnione
- ✅ Długi opis 1200-2200 znaków
- ✅ Quality Score > 75

---

## 📦 Format CSV

```csv
indeks,nazwa,kategoria,opis,dodatkowy opis,material,dlugosc,szerokosc,wysokosc,kolor,gwarancja,ean
HT1R232,Zestaw narzędziowy 112 szt.,Narzędzia mechaniczne,"Opis produktu...","Dodatkowy opis...","Stal CrV",405,404,318,,25-letnia,5901867145543
```

**Wymagane kolumny:**
- `indeks` (SKU)
- `nazwa` (nazwa produktu)
- `kategoria`
- `opis` (podstawowy opis)

**Opcjonalne (ale zalecane):**
- `material`, `dlugosc`, `szerokosc`, `wysokosc`, `kolor`, `gwarancja`, `ean`

---

## 🎯 Co testować?

### **TEST 1: Podstawowa generacja**
- Wczytaj DANE_TESTOWE.csv
- Wygeneruj opisy dla 3 produktów
- Sprawdź czy Meta Description kończy się poprawnie

### **TEST 2: Różne typy produktów**
- Zestawy narzędzi (complex)
- Pojedyncze narzędzia (simple)
- Odzież (T-shirt)
- Akcesoria (latarka)

### **TEST 3: Edge cases**
- Produkt bez opisu
- Produkt z długą nazwą (>100 znaków)
- Produkt z minimalnymi danymi

---

## 🐛 Typowe problemy

### **"BRAK KLUCZA API GEMINI"**
→ Ustawienia → Wklej API Key → Zapisz → Odśwież (F5)

### **Meta Description kończy się "..."**
→ Wyczyść cache: Ctrl+Shift+R (Win/Linux) lub Cmd+Shift+R (Mac)

### **Puste "3 Kluczowe Cechy"**
→ Dodaj więcej danych w CSV (materiał, wymiary, funkcje)

### **Quality Score <70**
→ Wzbogać dane w CSV (dodaj opisy, wymiary, materiały)

---

## 📊 Feedback

**Po testach wypełnij feedback:**

1. Co działa dobrze?
2. Co wymaga poprawy?
3. Jakie błędy znalazłeś?
4. Czy użyłbyś tego w produkcji?

**Wyślij na:** [kontakt@gtv.pl] lub Slack #product-generator

---

## 🔒 Bezpieczeństwo

**❌ NIE UDOSTĘPNIAJ:**
- Gemini API Key (prywatny!)
- CSV z danymi produkcyjnymi (RODO!)

**✅ MOŻESZ UDOSTĘPNIĆ:**
- Link do demo
- Screenshoty (bez danych wrażliwych)
- Feedback

---

## 📦 Struktura projektu

```
product_app_V8_ONLINE_DEMO/
├── index.html                     # Główna aplikacja
├── INSTRUKCJA_DEMO_ONLINE.md     # Szczegółowa instrukcja
├── DANE_TESTOWE.csv              # Przykładowe dane
├── README.md                     # Ten plik
├── js/
│   ├── app.js                    # Logika + AUTO-FIX v8.3
│   ├── optimizedPromptGenerator.js
│   ├── textUtils.js
│   ├── configManager.js
│   └── ecommerce_content_rules_v706.js
└── css/
    └── style.css                 # Style aplikacji
```

---

## 🚀 Następne kroki

**Po testach zespołowych:**
1. Zbierz feedback od zespołu
2. Napraw znalezione błędy
3. Wdróż w produkcji (z backend API)
4. Monitoruj jakość opisów

---

## 📞 Wsparcie

- **Pytania techniczne:** [Twój kontakt]
- **Problemy z API Key:** https://aistudio.google.com/app/apikey
- **Dokumentacja:** INSTRUKCJA_DEMO_ONLINE.md

---

## 📋 Changelog

### V8.3 AUTO-FIX (2 stycznia 2026)
- ✅ AUTO-FIX Meta Description (usuwa "..." i urwane CTA)
- ✅ Backup bulletPoints z CSV
- ✅ Quality Score 75-85/100
- ✅ 100% testów passed

---

**Wersja:** V8.3 AUTO-FIX (DEMO)  
**Status:** READY FOR TEAM TESTING ✅  
**Data:** 2 stycznia 2026

**Powodzenia w testach!** 🚀
