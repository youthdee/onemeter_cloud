const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter correct email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [8, 'Minimum password length is 8 characters']
    }
});


// po savenuti do db
userSchema.post('save', function (doc, next) {
    console.log('new user was created and saved', doc);
    next();
})
//pred savenutim do db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); //hashovani hesla

    next();
})

//static mehtod to login

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            console.log(user);
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}


const user = mongoose.model('users', userSchema); //nutno zadat mongoose DB jmeno tak jak je

module.exports = user;