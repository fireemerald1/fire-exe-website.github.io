// Bad words filter with character substitution detection
async function containsBadWords(text) {
    try {
        // Fetch bad words list
        const response = await fetch('https://raw.githubusercontent.com/fireemerald1/asdbhjawbhdkjabnsdkjbwa/refs/heads/main/badwords.json');
        const data = await response.json();
        const badWords = data.forbidden_words || [];
        
        if (!badWords.length) {
            console.warn('Bad words list is empty or invalid');
            return false;
        }
        
        // Normalize text for checking (lowercase, remove extra spaces)
        let normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
        
        // Create a version of the text with common character substitutions replaced
        let substitutedText = normalizedText
            .replace(/1/g, 'i')
            .replace(/0/g, 'o')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/5/g, 's')
            .replace(/7/g, 't')
            .replace(/8/g, 'b')
            .replace(/9/g, 'g')
            .replace(/@/g, 'a')
            .replace(/\$/g, 's')
            .replace(/\+/g, 't')
            .replace(/\(/g, 'c')
            .replace(/\)/g, 'o')
            .replace(/\*/g, 'a')
            .replace(/!/g, 'i');
        
        // Check both original and substituted text for bad words
        for (const badWord of badWords) {
            // Check for exact matches with word boundaries
            const regex = new RegExp('\\b' + badWord + '\\b', 'i');
            if (regex.test(normalizedText) || regex.test(substitutedText)) {
                return true;
            }
            
            // Check for intentional spacing or special characters between letters
            const spacedRegex = new RegExp(badWord.split('').join('[\\s\\W_]*'), 'i');
            if (spacedRegex.test(normalizedText) || spacedRegex.test(substitutedText)) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error checking bad words:', error);
        return false; // In case of error, allow the message to be posted
    }
}
