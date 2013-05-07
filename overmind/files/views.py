""" views.py: Files Views """

__author__ = "Michael Martin"

import json
import base64
import logging

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from boto.s3.connection import S3Connection

from file_service import FileService

# models
from management.keys import Keys
from models import Users

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# FILES VIEW
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# GET USER FILES - fetch all user files
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def getUserFiles(request):

    if 'secret_key' in request.POST:

        # get parameters
        secret_key = request.POST.get('secret_key')

        # get user
        user = Users.query(Users.secret_key == secret_key).get()

        if user:

            # get user files
            userFiles = FileService.getUserFiles(user)

            return HttpResponse(json.dumps({'user_files': userFiles}), mimetype='application/json', status='200')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')


# UPLOAD BASE 64 FILE - uploads base64 encoded file to s3
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def uploadBase64File(request):

    if 'secret_key' in request.POST and 'file' in request.POST:

        # get parameters
        secret_key = request.POST.get('secret_key')

        # get user
        user = Users.query(Users.secret_key == secret_key).get()

        if user:

            # get file named 'file' and write to s3
            base64File = request.POST['file']

            # decode base64
            decodedFile = base64.decodestring(base64File)

            fileType = 'jpg'

            # write file to S3
            uploadURL = FileService.writeToS3(decodedFile, fileType)

            # add user_file
            userFileKey = FileService.addUserFile(user, uploadURL, fileType)

            return HttpResponse(json.dumps({'url': uploadURL, 'user_file_id': userFileKey.urlsafe()}), mimetype='application/json', status='200')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
