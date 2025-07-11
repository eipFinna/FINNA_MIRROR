const dbService = require("../services/dbService");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("registerUser called with email:", email);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await dbService.registerUserInDB(email, hashedPassword);
        console.log("User registered successfully:", newUser);

        // Auto-login the user after registration
        req.login(newUser, (err) => {
            if (err) {
                console.error("Auto-login error:", err);
                return res.status(201).json({
                    message: "User registered successfully, but auto-login failed",
                    user: {
                        id: newUser.id,
                        email: newUser.email
                    }
                });
            }

            res.status(201).json({
                message: "User registered and logged in successfully",
                authenticated: true,
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            });
        });

    } catch (error) {
        console.error("Error registering user:", error);
        if (error.message.includes("duplicate key value violates unique constraint")) {
            return res.status(409).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: "An error occurred while registering the user." });
    }
}