from google.appengine.ext import ndb


# API KEYS
class ApiKeys(ndb.Model):
    name             = ndb.StringProperty()
    value            = ndb.StringProperty()


# USERS
class Users(ndb.Model):
    username         = ndb.StringProperty(required=False)
    password         = ndb.StringProperty()
    email            = ndb.StringProperty()
    secret_key       = ndb.StringProperty()
    reset_code       = ndb.StringProperty(required=False)
    update_timestamp = ndb.StringProperty(required=False)
    admin            = ndb.BooleanProperty(required=False, default=False)

    date_created     = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# TAGS
class Tags(ndb.Model):
    user             = ndb.KeyProperty(kind=Users)

    title            = ndb.StringProperty()
    slug             = ndb.StringProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# Sites
class Sites(ndb.Model):
    url              = ndb.StringProperty()
    popularity       = ndb.IntegerProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)


# FILES
class Files(ndb.Model):
    title            = ndb.StringProperty()
    caption          = ndb.StringProperty()
    meta             = ndb.TextProperty()
    file_location    = ndb.StringProperty()
    file_type        = ndb.StringProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)


class UserItems(ndb.Model):
    site             = ndb.KeyProperty(kind=Sites)
    user             = ndb.KeyProperty(kind=Users)

    search_tags      = ndb.StringProperty()
    title            = ndb.StringProperty()
    rating           = ndb.StringProperty()
    note             = ndb.TextProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# UserItems <-> Tags LINK
class ItemTags(ndb.Model):
    user_item        = ndb.KeyProperty(kind=UserItems)
    tag              = ndb.KeyProperty(kind=Tags)


# UserItems <-> Files LINK
class ItemFiles(ndb.Model):
    user_item        = ndb.KeyProperty(kind=UserItems)
    user_file        = ndb.KeyProperty(kind=Files)
    user             = ndb.KeyProperty(kind=Users)
