const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
                },
                message: 'Please enter a valid email address.',
        }
    },
    password: {type: String, required: true},
    profileImageUrl: {type: String}
}, {collection: "users"});

function sha256Encode(str){
    return crypto.createHash('sha256').update(str).digest('hex');
}

userSchema.pre("save", async function (next) {
    if (this.isModified("email")){
        this.email = this.email.toLowerCase();
        this.profileImageUrl = `https://gravatar.com/avatar/${sha256Encode(this.email)}`;
    }

    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

module.exports = mongoose.model('User', userSchema);
