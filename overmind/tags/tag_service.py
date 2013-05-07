""" tag_service.py: Tags Service """

__author__ = "Michael Martin"

import logging
import uuid

from django.template.defaultfilters import slugify

# models
from models import UserTags


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
        userTag = UserTags.query(UserTags.user == user.key, UserTags.slug == tagSlug).get()

        # create site
        if userTag is None:

            # create tag
            userTag = UserTags(title=tag, slug=tagSlug, user=user.key)
            userTag.put()

        return userTag
