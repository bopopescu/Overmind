"""management.py: Admin Tools """

__author__ = "Michael Martin"

import json

from authentication import Authentication
from keys import Keys

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# setAPIKey
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@Authentication.authenticate_admin
def setAPIKey(request):

    if all(k in request.GET for k in ('name', 'value')):

        # get user parameters
        key_name = request.GET.get('name')
        key_value = request.GET.get('value')

        # set key
        Keys.set_key(key_name, key_value)

        return HttpResponse(json.dumps({'status': 'success'}), mimetype='application/json')
    else:
        return HttpResponse(json.dumps({'status': 'missing_param'}), mimetype='application/json', status='400')
