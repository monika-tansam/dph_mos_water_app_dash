// Hardcoded captcha value
const validCaptcha = 'ABCD1234';

const validateCaptcha = (captcha) => {
    return captcha === validCaptcha;
};

module.exports = validateCaptcha;
    