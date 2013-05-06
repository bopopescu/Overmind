"""views.py: User Views """

__author__ = "Michael Martin"

import hashlib
import time
import json
import uuid
import logging

from google.appengine.api import mail
from google.appengine.ext import ndb

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

# models
from models import Users

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# USER VIEW
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# LOGIN
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def login(request):

    if all(k in request.POST for k in ('username', 'password')):

        # get user parameters
        username = request.POST.get('username')
        password = request.POST.get('password')

        # hash password
        hashed_password = hashlib.md5(password).hexdigest()

        # validate login
        user = Users.query(Users.username == username, Users.password == hashed_password).get()

        if user:
            # generate secret key
            secret_key = hashlib.md5(username)
            secret_key.update(str(time.time()))
            secret_key = secret_key.hexdigest()

            # save secret key
            user.secret_key = secret_key
            user.put()

            # construct return object
            data = {
                'user_id': user.key.urlsafe(),
                'secret_key': secret_key,
                'time_stamp': user.update_timestamp,
                'username': user.username
            }

            return HttpResponse(json.dumps(data), mimetype='application/json')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')


# CREATE USER
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def createUser(request):

    if all(k in request.POST for k in ('username', 'password')):

        # collect user parameters
        username = request.POST.get('username')
        password = request.POST.get('password')

        # check existing email
        user = Users.query(Users.username == username).get()

        # user does not exist: create new user
        if user is None:
            # hash password
            password = hashlib.md5(password).hexdigest()

            # generate secret key
            secret_key = hashlib.md5(username)
            secret_key.update(str(time.time()))
            secret_key = secret_key.hexdigest()

            # create user
            user = Users(username=username, password=password, secret_key=secret_key)
            userKey = user.put()

            # construct return object
            data = {
                'user_id': userKey.urlsafe(),
                'secret_key': secret_key,
                'username': username
            }

            return HttpResponse(json.dumps(data), mimetype='application/json')

        # username exists
        else:
            return HttpResponse(json.dumps({'status': 'user_exists'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
