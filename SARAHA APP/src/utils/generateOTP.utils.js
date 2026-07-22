export function generateOTP(length = 6) {
    return Math.floor(Math.random() * (800000+100000)+100000)
}