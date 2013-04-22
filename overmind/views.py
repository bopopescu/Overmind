"""management.py: Admin Tools """

__author__ = "Michael Martin"
__status__ = "Production"

from django.shortcuts import render_to_response
from django.http import HttpResponse
from boto.s3.connection import S3Connection

import logging


S3_URL = 'https://s3.amazonaws.com/'
S3_ACCESS_KEY = ''
S3_SECRET_KEY = ''
ASSET_BUCKET = 's3.overmind.io-uploads'

AWS_HEADERS = {
    'Cache-Control': 'max-age=2592000,public'
}
AWS_ACL = 'public-read'


# index page
def index(request):

    context = {}

    return render_to_response('index.html', context)


def upload(request):

    # get file named 'file'
    file = request.FILES['file']
    content = file.read()

    # get s3 bucket
    s3conn = S3Connection(S3_ACCESS_KEY, S3_SECRET_KEY, is_secure=False)
    bucket = s3conn.get_bucket(ASSET_BUCKET, validate=False)
    # create new S3 key, set mimetype
    k = bucket.new_key('my_file.png')
    k.content_type = 'image/png'

    # write file from response string set public read permission
    k.set_contents_from_string(content, headers=AWS_HEADERS, replace=True, policy=AWS_ACL)
    k.set_acl('public-read')

    # s3 url
    return HttpResponse('success', mimetype='text/plain', status='200')
