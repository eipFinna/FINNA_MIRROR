const bcrypt = require("bcryptjs");
const dbService = require("../services/dbService");

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("loginUser called with email:", email);

        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        const user = await dbService.getUserByEmail(email);
        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password.");
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("An error occured while logging in the user.")
    }
}