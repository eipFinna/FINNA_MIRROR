const { exec } = require('child_process');

exports.getKeywords = (inputText) => {
    return new Promise((resolve, reject) => {
        exec(`python3 services/aiKeyword.py "${inputText}"`, (error, stdout, stderr) => {
            if (error) return reject(error);
            if (stderr) return reject(stderr);
            resolve(stdout.trim());
        });
    });
};

// Fonction pour résumer le texte avec le script Python
exports.summarizeWithPython = (text) => {
    return new Promise((resolve, reject) => {
        const command = `python3 services/aiSummarize.py "${text.replace(/"/g, '\\"')}"`; // Échapper les guillemets
        exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error("Erreur lors de l'exécution du script Python :", error);
                return reject(error);
            }
            if (stderr) {
                console.error("Erreur STDERR depuis le script Python :", stderr);
                return reject(stderr);
            }
            resolve(stdout.trim());
        });
    });
};
