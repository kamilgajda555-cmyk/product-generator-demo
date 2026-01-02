// Test 5: TextUtils (V8.1)
function testTextUtils() {
    const output = document.getElementById('textutils-test');
    try {
        // Test 1: Ucięte zdania
        const longText = 'To jest dlugi tekst. ' + 'Dodatkowe zdanie. '.repeat(300) + 'Ostatnie zdanie.';
        const truncated = TextUtils.truncateToCompleteSentence(longText, 3900);
        const endsWithPeriod = truncated.endsWith('.');
        
        // Test 2: Meta Description
        const longMeta = 'To jest bardzo dlugi meta description ktory przekracza limit 160 znakow i powinien zostac obciety na pelnym slowie z dodaniem kropek na koncu';
        const optimizedMeta = TextUtils.optimizeMetaDescription(longMeta, 157);
        
        // Test 3: Usuń "producent nie podaje"
        const textWithPhrase = 'Produkt jest dobry. Producent nie podaje szczegolowych wymiarow. Material: stal.';
        const cleaned = TextUtils.removeUnavailableDataPhrases(textWithPhrase);
        
        // Test 4: Dodaj indeks do tagów
        const tags = 'gniazdo meblowe,charger plus,usb';
        const tagsWithIndex = TextUtils.addProductIndexToTags(tags, 'AE-BPW1SACP-10');
        
        output.innerHTML = `
            <div class="success">✅ TextUtils dziala!</div>
            <h4>Test 1: Uciete zdania</h4>
            <div class="info">Dlugosc: ${truncated.length} znakow</div>
            <div class="info">Zakonczone kropka: ${endsWithPeriod ? '✅ TAK' : '❌ NIE'}</div>
            
            <h4>Test 2: Meta Description</h4>
            <div class="info">Oryginal: ${longMeta.length} znakow</div>
            <div class="info">Zoptymalizowany: ${optimizedMeta.length} znakow</div>
            <pre>${optimizedMeta}</pre>
            
            <h4>Test 3: Usun "producent nie podaje"</h4>
            <div class="info">Przed: ${textWithPhrase}</div>
            <div class="info">Po: ${cleaned}</div>
            
            <h4>Test 4: Dodaj indeks do tagow</h4>
            <div class="info">Przed: ${tags}</div>
            <div class="info">Po: ${tagsWithIndex}</div>
        `;
    } catch (error) {
        output.innerHTML = `<div class="error">❌ Blad: ${error.message}</div>`;
    }
}
