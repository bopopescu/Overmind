""" views.py: Files Views """

__author__ = "Michael Martin"

import json
import logging

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

# services
from item_service import ItemService
from tags.tag_service import TagService

# models
from models import Users, Sites

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ITEMS VIEW
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# addUserItem -
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def addUserItem(request):

    if all(k in request.POST for k in ('secret_key', 'site_url', 'title', 'file_ids', 'tag_ids')):

        # get parameters
        secretKey = request.POST.get('secret_key')
        siteURL = request.POST.get('site_url')
        title = request.POST.get('title')
        fileIDs = request.POST.getlist('file_ids[]')
        tags = request.POST.getlist('tags[]')

        # get user
        user = Users.query(Users.secret_key == secretKey).get()

        if user:

            # get or create new site from url
            site = ItemService.getOrCreateSite(siteURL)

            # iterate tags
            tagList = []
            for tag in tags:

                # get or create tag
                tag = TagService.getOrCreateTag(tag, user)
                tagList.append(tag)


            return HttpResponse(json.dumps({'something': 'hi'}), mimetype='application/json', status='200')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
