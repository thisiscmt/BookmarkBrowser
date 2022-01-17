import fs from 'fs';
import multer from 'multer';
import path from 'path';

import * as Constants from '../constants.js';

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        const dirPath = path.join(process.cwd(), 'app_data', request.params.id);
        let stat = null;

        try {
            stat = fs.statSync(dirPath);
        } catch (err) {
            fs.mkdirSync(dirPath);
        }

        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        }

        cb(null, dirPath);
    },
    filename: function (request, file, cb) {
        cb(null, Constants.BOOKMARK_DATA_FILE);
    }
});

export default storage;
