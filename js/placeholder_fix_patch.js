// V8.1 HOTFIX v7 - PLACEHOLDER AUTO-FIX (nie blokuj)
// Wstaw to w validateAndEnsureUniqueness zamiast throw Error

function autoFixPlaceholders(content) {
    console.log('🔧 Auto-fixing placeholders...');
    
    let fixed = { ...content };
    
    // Napraw bullet points
    if (fixed.bulletPoints) {
        fixed.bulletPoints = fixed.bulletPoints
            .replace(/\.\.\./g, '.')  // Zamień ... na .
            .replace(/…/g, '.')       // Zamień … na .
            .replace(/\betc\.\s*$/gm, '.')  // Usuń "etc." na końcu linii
            .replace(/<li>[^<]*\.\.\.[^<]*<\/li>/g, '')  // Usuń całe <li> z ...
            .replace(/<li>\s*<\/li>/g, '');  // Usuń puste <li>
    }
    
    // Napraw długi opis
    if (fixed.longDescription) {
        let desc = fixed.longDescription;
        
        // Usuń zdania z ...
        desc = desc.replace(/[^.!?]*\.\.\.[^.!?]*/g, '');
        
        // Napraw urwane słowa (słowo...)
        desc = desc.replace(/\b(\w+)\.\.\./g, '$1.');
        
        // Zamień ... na .
        desc = desc.replace(/\.\.\./g, '.');
        desc = desc.replace(/…/g, '.');
        
        // Usuń "etc."
        desc = desc.replace(/\betc\.\s*/g, '');
        
        // Upewnij się że kończy się pełnym zdaniem
        if (!desc.match(/[.!?]\s*(<\/[^>]+>)*\s*$/)) {
            desc = desc.replace(/\s*(<\/[^>]+>)*\s*$/, '.$1');
        }
        
        fixed.longDescription = desc;
    }
    
    // Napraw meta description
    if (fixed.metaDescription) {
        fixed.metaDescription = fixed.metaDescription
            .replace(/\.\.\./g, '.')
            .replace(/…/g, '.')
            .replace(/\betc\.\s*$/g, '.');
        
        // Jeśli kończy się niepełnym zdaniem, dodaj kropkę
        if (!fixed.metaDescription.match(/[.!?]$/)) {
            fixed.metaDescription = fixed.metaDescription.trim() + '.';
        }
    }
    
    // Napraw whyWorthIt
    if (fixed.whyWorthIt) {
        fixed.whyWorthIt = fixed.whyWorthIt
            .replace(/\.\.\./g, '.')
            .replace(/…/g, '.')
            .replace(/\betc\.\s*$/g, '.');
    }
    
    console.log('✅ Placeholders naprawione automatycznie');
    return fixed;
}

// NOWA LOGIKA - zamiast throw Error:
if (foundPlaceholders.length > 0) {
    console.warn('⚠️ PLACEHOLDERS DETECTED:', foundPlaceholders);
    console.warn('⚠️ Auto-fixing placeholders...');
    
    // AUTO-FIX zamiast blokowania
    content = autoFixPlaceholders(content);
    
    // Sprawdź ponownie
    const recheckContent = [
        content.metaTitle || '',
        content.metaDescription || '',
        content.bulletPoints || '',
        content.longDescription || ''
    ].join(' ');
    
    let recheckPlaceholders = [];
    placeholderTokens.forEach(token => {
        if (recheckContent.toLowerCase().includes(token.toLowerCase())) {
            recheckPlaceholders.push(token);
        }
    });
    
    if (recheckPlaceholders.length > 0) {
        console.error('❌ Nie udało się naprawić wszystkich placeholderów:', recheckPlaceholders);
        throw new Error(`Content contains unfixable placeholders: ${recheckPlaceholders.join(', ')}`);
    }
    
    console.log('✅ Placeholders naprawione pomyślnie');
} else {
    console.log('✅ Placeholders check OK');
}
