#!/bin/bash

# Deployment script for Product Generator Demo

echo "🚀 Product Generator V8.3 DEMO - Deployment Script"
echo "=================================================="
echo ""

# Sprawdź czy pliki istnieją
if [ ! -f "index.html" ]; then
    echo "❌ Błąd: Brak pliku index.html"
    exit 1
fi

echo "✅ Pliki zweryfikowane"
echo ""

# Menu wyboru platformy
echo "Wybierz platformę hostingową:"
echo "1) GitHub Pages"
echo "2) Netlify"
echo "3) Vercel"
echo "4) Lokalny serwer (test)"
echo ""
read -p "Wybór (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploy na GitHub Pages:"
        echo "1. Utwórz repozytorium GitHub:"
        echo "   gh repo create product-generator-demo --public"
        echo ""
        echo "2. Push plików:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'V8.3 DEMO'"
        echo "   git branch -M main"
        echo "   git remote add origin https://github.com/[username]/product-generator-demo.git"
        echo "   git push -u origin main"
        echo ""
        echo "3. Włącz GitHub Pages:"
        echo "   Settings → Pages → Source: main branch → Save"
        echo ""
        echo "4. Link:"
        echo "   https://[username].github.io/product-generator-demo/"
        ;;
    
    2)
        echo ""
        echo "📦 Deploy na Netlify:"
        
        # Sprawdź czy Netlify CLI jest zainstalowane
        if ! command -v netlify &> /dev/null; then
            echo "⚠️  Netlify CLI nie jest zainstalowane"
            echo ""
            echo "Instalacja:"
            echo "  npm install -g netlify-cli"
            echo ""
            exit 1
        fi
        
        echo "Logowanie do Netlify..."
        netlify login
        
        echo ""
        echo "Deploy..."
        netlify deploy --prod
        
        echo ""
        echo "✅ Gotowe! Link do demo:"
        echo "   https://[random-name].netlify.app/"
        ;;
    
    3)
        echo ""
        echo "📦 Deploy na Vercel:"
        
        # Sprawdź czy Vercel CLI jest zainstalowane
        if ! command -v vercel &> /dev/null; then
            echo "⚠️  Vercel CLI nie jest zainstalowane"
            echo ""
            echo "Instalacja:"
            echo "  npm install -g vercel"
            echo ""
            exit 1
        fi
        
        echo "Deploy..."
        vercel --prod
        
        echo ""
        echo "✅ Gotowe! Link do demo:"
        echo "   https://[random-name].vercel.app/"
        ;;
    
    4)
        echo ""
        echo "🖥️  Uruchamianie lokalnego serwera..."
        echo ""
        
        # Sprawdź czy Python 3 jest dostępny
        if command -v python3 &> /dev/null; then
            echo "Serwer: http://localhost:8000"
            echo "Naciśnij Ctrl+C aby zatrzymać"
            echo ""
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "Serwer: http://localhost:8000"
            echo "Naciśnij Ctrl+C aby zatrzymać"
            echo ""
            python -m http.server 8000
        else
            echo "❌ Python nie jest zainstalowany"
            echo ""
            echo "Alternatywa (Node.js):"
            echo "  npx serve"
            exit 1
        fi
        ;;
    
    *)
        echo "❌ Nieprawidłowy wybór"
        exit 1
        ;;
esac

echo ""
echo "=================================================="
echo "✅ Deployment zakończony!"
echo ""
echo "📋 Następne kroki:"
echo "1. Otwórz link demo"
echo "2. Ustawienia → Wklej Gemini API Key"
echo "3. Wczytaj DANE_TESTOWE.csv"
echo "4. Generuj opisy!"
echo ""
echo "📞 Wsparcie: Zobacz README.md"
echo "=================================================="
