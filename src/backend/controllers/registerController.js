const dbService = require("../services/dbService");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("registerUser called with email:", email);


        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await dbService.registerUserInDB(email, hashedPassword);
        console.log("User registered successfully:", newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        if (error.message.includes("duplicate key value violates unique constraint")) {
            return res.status(409).send("Email already exists.");
        }
        res.status(500).send("An error occurred while registering the user.");
    }
}