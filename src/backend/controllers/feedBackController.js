const axios = require('axios');

// URL du webhook Discord
const webhookUrl = 'placeholder';

exports.postFeedback = async (req, res) => {
    const feedBack = req.body.feedback;
    const email = req.body.email;

    const message = {
        content: 'L\'utilisateur: ' + email + ' nous suggère: ' + feedBack, // Contenu du message
        username: 'FINNA SUGGESTION', // Nom d'utilisateur du bot (optionnel)
        avatar_url: 'https://acornsonglen.com/wp-content/uploads/2012/08/funny-raccoon.jpg' // URL de l'avatar du bot (optionnel)
    };

// Envoyer le message au webhook
axios.post(webhookUrl, message)
    .then(response => {
        console.log('Message envoyé avec succès !');
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du message :', error);
    });

};

// Envoie de mail a faire plus tard si possible

// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: '', // votre adresse email
//         pass: '' // votre mot de passe
//     }
// });



// exports.postFeedback = async (req, res) => {
//     const feedBack = req.body.feedback;
//     const email = req.body.email;

//     let mailOptions = {
//         from: '', // adresse de l'expéditeur
//         to: '', // adresse du destinataire
//         subject: 'Finna, nouvelle suggestion', // sujet de l'email
//         text: 'l\'utilisateur: ' + email + ' nous suggère: ' + feedBack, // contenu de l'email en texte brut
//     };
//     console.log(req.body.feedback);
//     console.log(req.body.email);

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//             res.json({ message: "Erreur lors de l'envoi de l'email" });
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.json({ message: "Email envoyé avec succès" });
//         }
//     });

//     console.log("Post feed back");

// };
