const { exec } = require('child_process');

exports.getKeywords = (inputText) => {
    return new Promise((resolve, reject) => {
        exec(`python3 services/summarization.py "${inputText}"`, (error, stdout, stderr) => {
            if (error) return reject(error);
            if (stderr) return reject(stderr);
            resolve(stdout.trim());
        });
    });
};
