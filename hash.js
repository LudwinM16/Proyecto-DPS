const bcrypt = require('bcryptjs');

async function hashPassword() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    console.log("Contraseña encriptada:", hashedPassword);
}

hashPassword();
