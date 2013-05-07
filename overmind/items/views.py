""" views.py: Files Views """

__author__ = "Michael Martin"

import json
import logging

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

# services
from item_service import ItemService

# models
from models import Users

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ITEMS VIEW
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# addUserItem -
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def addUserItem(request):

    if all(k in request.POST for k in ('secret_key', 'site_url', 'title', 'search_tags', 'note')):

        # get parameters
        secretKey = request.POST.get('secret_key')
        siteURL = request.POST.get('site_url')
        title = request.POST.get('title')
        searchTags = request.POST.get('search_tags')
        note = request.POST.get('note')
        fileIDs = request.POST.getlist('file_ids[]')
        tags = request.POST.getlist('tags[]')

        # get user
        user = Users.query(Users.secret_key == secretKey).get()

        if user:

            # create user item
            userItem = ItemService.createUserItem(user, siteURL, title, searchTags, note, fileIDs, tags)

            return HttpResponse(json.dumps({'something': 'hi'}), mimetype='application/json', status='200')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
