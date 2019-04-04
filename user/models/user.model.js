const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//require("./config/config");


var userSchema = mongoose.Schema({
    firstName: { type: String, required: "First Name can't be empty." },
    lastName: { type: String, required: "Last Name can't be empty." },
    displayName: { type: String, required: "Display Name can't be empty." },
    buName: { type: String, required: "Business Unit Name can't be empty." },
    email: { type: String, required: "Email can't be empty.", unique: true },
    empId: { type: String, required: "Employee Id can't be empty.", unique: true },
    role: { type: String, default: 'Normal', required: "User role can't be empty." },
    createdDt: { type: Date },
    updatedDt: { type: Date },
    userStatus: { type: String, default: 'Active', required: "Active Status can't be empty." },
    password: {
        type: String, required: "Password can't be empty.",
        minlength: [4, "Password must be atleast 4 characters long."]
    },
    saltSecret: String
});

userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            console.log(this.email);
            this.password = hash;
            this.saltSecret = salt;
            next();
        })
    });
});


// Methods
userSchema.methods.verifyPassword = (function (password) {
    return bcrypt.compareSync(password, this.password);
});

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXT
        });
}

mongoose.model('User', userSchema);