""" file_service.py: Files Service """

__author__ = "Michael Martin"

import logging
import uuid
from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor
from boto.s3.connection import S3Connection

# services
from management.keys import Keys

# models
from models import Users, UserFiles, Files


S3_URL = 'https://s3.amazonaws.com/'
S3_ACCESS_KEY = 'AMAZON_ACCESS_KEY'
S3_SECRET_KEY = 'AMAZON_SECRET_KEY'
ASSET_BUCKET = 's3.overmind.io-uploads'

AWS_HEADERS = {
    'Cache-Control': 'max-age=2592000,public'
}
AWS_ACL = 'public-read'

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# FILES SERVICE
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# S3 URL: https://s3.amazonaws.com/s3.overmind.io-uploads/[file_name].[ext]


class FileService(object):

    # getUserFile -
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserFile(userFileKey):

        # get item by key
        userFile = userFileKey.get()

        userFileObj = {
            'id': userFile.key.urlsafe(),
            'url': userFile.file_location,
            'file_type': userFile.file_type,
            'title': userFile.title,
            'caption': userFile.caption,
            'meta': userFile.meta,
            'date_added': str(userFile.date_added),
            'date_modified': str(userFile.date_modified),
        }

        return userFileObj

    # Get User Files
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserFiles(user, cursorString):

        # get next page
        if (cursorString != ''):
            inputCursor = Cursor(urlsafe=cursorString)
            userFilesQuery, cursor, more = UserFiles.query(UserFiles.user == user.key).fetch_page(4, start_cursor=inputCursor)

        # first page
        else:
            userFilesQuery, cursor, more = UserFiles.query(UserFiles.user == user.key).fetch_page(4)

        cursorURLSafe = cursor.urlsafe()

        userFiles = {
            'user_files_list': [],
            'cursor': cursorURLSafe,
            'more': more
        }

        # list items found
        if userFilesQuery:

            # construct python list
            for userFile in userFilesQuery:

                userFileObj = FileService.getUserFile(userFile.user_file)
                userFiles['user_files_list'].append(userFileObj)

            return userFiles

        return None

    # Add User File
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def addUserFile(user, fileLocation, fileType):

        # add file
        fileKey = FileService.addFile(fileLocation, fileType)

        # add user file
        userFile = UserFiles(user=user.key, user_file=fileKey)
        userFileKey = userFile.put()

        return fileKey

    # Add File
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def addFile(fileLocation, fileType):

        # save new file
        newFile = Files(file_location=fileLocation, file_type=fileType)
        fileKey = newFile.put()

        return fileKey

    # Write to S3
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def writeToS3(file, fileType):

        # generate filename
        filename = str(uuid.uuid4()) + '.' + fileType

        # get s3 bucket
        s3conn = S3Connection(Keys.get_key(S3_ACCESS_KEY), Keys.get_key(S3_SECRET_KEY), is_secure=False)
        bucket = s3conn.get_bucket(ASSET_BUCKET, validate=False)

        # create new S3 key
        k = bucket.new_key(filename)

        # set mimetype
        if (fileType == 'jpg'):
            mimeType = 'image/jpeg'
        elif (fileType == 'png'):
            mimeType = 'image/png'
        elif (fileType == 'gif'):
            mimeType = 'image/gif'
        elif (fileType == 'css'):
            mimeType = 'text/css'
        elif (fileType == 'js'):
            mimeType = 'application/javascript'

        k.content_type = mimeType

        # write file from response string set public read permission
        k.set_contents_from_string(file, headers=AWS_HEADERS, replace=True, policy=AWS_ACL)
        k.set_acl('public-read')

        url = S3_URL + ASSET_BUCKET + '/' + filename

        return url
