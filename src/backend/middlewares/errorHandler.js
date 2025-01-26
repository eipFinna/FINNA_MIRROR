module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue.');
};
