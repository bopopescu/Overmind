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
    api_key          = ndb.StringProperty()
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


# SEARCH TAGS
class SearchTags(ndb.Model):
    user             = ndb.KeyProperty(kind=Users)
    tag              = ndb.StringProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# ITEMS
class Items(ndb.Model):
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


# USER ITEMS
class UserItems(ndb.Model):
    item             = ndb.KeyProperty(kind=Items)
    user             = ndb.KeyProperty(kind=Users)
    tag              = ndb.KeyProperty(kind=Tags)
    search_tag       = ndb.KeyProperty(kind=SearchTags)
    files            = ndb.KeyProperty(kind=Files)

    title            = ndb.StringProperty()
    note             = ndb.TextProperty()
    rating           = ndb.StringProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)
