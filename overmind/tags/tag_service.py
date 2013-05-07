""" tag_service.py: Tags Service """

__author__ = "Michael Martin"

import logging
import uuid

from django.template.defaultfilters import slugify

# models
from models import Users, Tags


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# TAG SERVICE
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class TagService(object):

    # Get or Create Tag
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getOrCreateTag(tag, user):

        # slugify
        tagSlug = slugify(tag)

        # get or create tag
        tag = Tags.query(Tags.user == user.key, Tags.slug == tagSlug).get()

        # create site
        if tag is None:

            # create tag
            tag = Tags(title=tag, slug=tagSlug, user=user.key)
            tag.put()

        return tag
