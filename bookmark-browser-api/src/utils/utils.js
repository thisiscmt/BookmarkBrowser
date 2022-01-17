import fs from 'fs';
import path from 'path';

const getUser = (userName) => {
    const filePath = path.join(process.cwd(), 'app_data', 'users.dat');
    const userData = fs.readFileSync(filePath, 'utf8');
    let user;

    if (userData) {
        const users = JSON.parse(userData);

        for (const knownUser of users) {
            if (knownUser.userName === userName) {
                user = knownUser;
                break;
            }
        }
    }

    return user;
}

const validUser = (user, creds) => {
    let valid = false;

    if (user && user.password === creds.password) {
        valid = true;
    }

    return valid;
}

export { getUser, validUser };
