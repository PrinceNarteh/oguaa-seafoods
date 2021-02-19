const crypto = require('crypto');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

const sentToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        sentToken(user, 201, res);
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password.', 400));
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePasswords(password))) {
            return next(new ErrorResponse('Invalid Credentials.', 401));
        }

        sentToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
}

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Email could not be sent', 404));
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetURL = `http://localhost:3000/passwordreset/${resetToken}`
        const message = `
        <h1>You have requested a password reset.</h1>
        <p>Please go to the link to reset your password.</p>
        <a href=${resetURL} clicktracking=off>${resetURL}</a>
        `
        try {
            sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                html: message
            })

            res.status(200).json({ success: true, data: "Email sent." })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            return next(new ErrorResponse('Email could not be send.', 500));
        }

    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return next(new ErrorResponse('Invalid Reset Token', 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({ success: true, data: "Password Reset Success." });
    } catch (error) {
        next(error);
    }
}