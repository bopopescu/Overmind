""" views.py : Index"""

__author__ = "Michael Martin"

from django.shortcuts import render_to_response
from django.http import HttpResponse

import logging

# index page
def index(request):

    context = {}

    return render_to_response('index.html', context)
