import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {Buffer} from 'buffer';

import storage from '../middleware/upload.js';
import * as Constants from '../constants.js';
import * as utils from '../utils/utils.js';

const upload = multer(
    {
        dest: 'data',
        limits: {
            fieldNameSize: 100,
            fileSize: 5242880
        },
        storage: storage
    }
).single('file');

const bookmarkRouter = express.Router();

bookmarkRouter.use((request, response, next) => {
    let pass = false;
    let decodedCreds;
    let creds;
    let index;

    try {
        delete request.currentUser;

        if (request.headers.authorization?.startsWith('Basic ')) {
            decodedCreds = Buffer.from(request.headers.authorization.substr(6), 'base64').toString('ascii');
            index = decodedCreds.indexOf(':');
            creds = {
                userName: decodedCreds.substr(0, index),
                password: decodedCreds.substr(index + 1)
            };

            const user = utils.getUser(creds.userName);

            if (utils.validUser(user, creds)) {
                pass = true;
                request.currentUser = user;
            } else {
                return response.status(403).send('Invalid credentials');
            }
        }

        if (!pass) {
            return response.status(403).send('Missing credentials');
        }
    } catch (error) {
        // TODO: Log this somewhere
        console.log(error);

        return response.status(500).send('An unexpected error occurred')
    }

    next();
});

bookmarkRouter.get('/', (request, response, next) => {
    const filePath = path.join(process.cwd(), 'app_data', request.currentUser.id, Constants.BOOKMARK_DATA_FILE);

    if (fs.statSync(filePath, { throwIfNoEntry: false })) {
        const bookmarkDataJSON = fs.readFileSync(filePath, { encoding: 'utf8' });
        const bookmarkDataObj = JSON.parse(bookmarkDataJSON);
        const rootBookmark = JSON.parse(bookmarkDataObj.bookmarkData);
        let bookmarkForSwap;
        let bookmarkCount = {
            count: 0
        };

        rootBookmark.path = 'Root';

        // Remove any top-level directories that have no children (e.g. 'Mobile Bookmarks' and 'Other Bookmarks')
        for (let i = rootBookmark.children.length - 1; i >= 0; i--) {
            if (!rootBookmark.children[i].hasOwnProperty('children')) {
                rootBookmark.children.splice(i, 1);
            }
        }

        // Put the bookmark toolbar element first since that is what will logically be the first set of bookmarks
        bookmarkForSwap = rootBookmark.children[0];
        rootBookmark.children[0] = rootBookmark.children[1];
        rootBookmark.children[1] = bookmarkForSwap;

        // We set certain metadata on each directory to make navigation easier on the client, plus we get a count of actual bookmarks
        setMetadata(rootBookmark, bookmarkCount);

        response.status(200).send({
            bookmarkData: rootBookmark,
            count: bookmarkCount.count,
            uploadTimestamp: bookmarkDataObj.uploadTimestamp
        });
    } else {
        response.status(500).send('Error reading bookmark data');
    }
});

bookmarkRouter.post('/', (request, response, next) => {
    upload(request, response, (error) => {
        if (error) {
            // TODO: Log this somewhere
            console.log(error);

            response.status(500).send('Error uploading file');
        } else {
            try {
                const filePath = path.join(process.cwd(), 'app_data', request.currentUser.id, Constants.BOOKMARK_DATA_FILE);

                try {
                    fs.statSync(filePath);
                } catch (error) {
                    fs.mkdirSync(path.dirname(filePath));
                }

                fs.writeFileSync(filePath, JSON.stringify(request.body), { encoding: 'utf8'});

                response.status(200).send();
            } catch (error) {
                response.status(500).send('Error storing bookmark data');
            }
        }
    });
});

const setMetadata = (bookmark, bookmarkCount) => {
    let newItem;

    if (bookmark.children) {
        bookmark.children.forEach(item => {
            if (item.type === 'text/x-moz-place-container') {
                item.path = bookmark.path + '\\' + item.title;
                item.type = 'Directory';
                newItem = item;

                setMetadata(newItem, bookmarkCount);
            }
            else if (item.type === 'text/x-moz-place') {
                item.type = 'Bookmark';
                bookmarkCount.count += 1;
            }
            else if (item.type === 'text/x-moz-place-separator') {
                item.type = 'Separator';
            }
        });
    }
}

export default bookmarkRouter;
