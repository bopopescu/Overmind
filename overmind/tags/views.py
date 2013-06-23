""" views.py: Tag Views """

__author__ = "Michael Martin"

import json
import logging

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

# services
from tag_service import TagService

# models
from models import Users

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# TAGS VIEW
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# getUserTags -
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@require_http_methods(['POST'])
def getUserTags(request):

    if 'secret_key' in request.POST:

        # get parameters
        secretKey = request.POST.get('secret_key')

        # get user
        user = Users.query(Users.secret_key == secretKey).get()

        if user:

            # get user items
            user_tags = TagService.getUserTags(user)

            return HttpResponse(json.dumps({'user_tags': user_tags}), mimetype='application/json', status='200')
        else:
            return HttpResponse(json.dumps({'status': 'invalid_login'}), mimetype='application/json', status='403')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
