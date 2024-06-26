document.getElementById('deobfuscateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const obfuscatedScript = document.getElementById('obfuscatedScript').value;
    const deobfuscatedScript = deobfuscateScript(obfuscatedScript);
    
    document.getElementById('deobfuscatedScript').textContent = deobfuscatedScript || 'Failed to deobfuscate the script.';
});

document.getElementById('copyButton').addEventListener('click', function() {
    const decryptedScript = document.getElementById('deobfuscatedScript').textContent;
    navigator.clipboard.writeText(decryptedScript).then(() => {
        alert('Copied to clipboard!');
    }, () => {
        alert('Failed to copy!');
    });
});

function deobfuscateScript(obfuscatedScript) {
    try {
        const encodedPattern = /local \w+ = \{\s*([^}]+)\s*\}/;
        const matches = obfuscatedScript.match(new RegExp(encodedPattern, 'g'));

        if (matches && matches.length >= 2) {
            const encodedParts = matches[0].match(encodedPattern)[1].split(',').map(str => parseInt(str.trim(), 10));
            const randomOffsets = matches[1].match(encodedPattern)[1].split(',').map(str => parseInt(str.trim(), 10));

            let originalScript = '';

            for (let i = 0; i < encodedParts.length; i++) {
                originalScript += String.fromCharCode(encodedParts[i] - randomOffsets[i]);
            }

            return formatLuaScript(originalScript);
        } else {
            throw new Error('Failed to extract encoded parts or offsets.');
        }

    } catch (e) {
        console.error('Deobfuscation failed:', e);
        return null;
    }
}

function formatLuaScript(script) {
    return script.replace(/;/g, ';\n');
}
