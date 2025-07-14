const bcrypt = require("bcryptjs");
const dbService = require("../services/dbService");

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("loginUser called with email:", email);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await dbService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Create session using Passport's login method
        req.login(user, (err) => {
            if (err) {
                console.error("Session creation error:", err);
                return res.status(500).json({ error: "Session creation failed" });
            }
            
            res.status(200).json({
                message: "Login successful",
                authenticated: true,
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "An error occurred while logging in the user." });
    }
}