from google.appengine.ext import ndb


# Api Keys
class ApiKeys(ndb.Model):
    name             = ndb.StringProperty()
    value            = ndb.StringProperty()


# Users
class Users(ndb.Model):
    username         = ndb.StringProperty()
    password         = ndb.StringProperty()
    email            = ndb.StringProperty()
    secret_key       = ndb.StringProperty()

    reset_code       = ndb.StringProperty(required=False)
    update_timestamp = ndb.StringProperty(required=False)
    admin            = ndb.BooleanProperty(required=False, default=False)

    date_created     = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# Tags
class UserTags(ndb.Model):
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
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# Files
class Files(ndb.Model):
    file_location    = ndb.StringProperty()
    file_type        = ndb.StringProperty()

    title            = ndb.StringProperty(required=False)
    caption          = ndb.StringProperty(required=False)
    meta             = ndb.TextProperty(required=False)

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# Files <-> Users LINK - Users have Files
class UserFiles(ndb.Model):
    user             = ndb.KeyProperty(kind=Users)
    user_file        = ndb.KeyProperty(kind=Files)

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# Site <-> User LINK - Users have Sites
class UserItems(ndb.Model):
    site             = ndb.KeyProperty(kind=Sites)
    user             = ndb.KeyProperty(kind=Users)

    search_tags      = ndb.StringProperty()
    title            = ndb.StringProperty()
    rating           = ndb.StringProperty()
    note             = ndb.TextProperty()

    date_added       = ndb.DateTimeProperty(auto_now=False, auto_now_add=True)
    date_modified    = ndb.DateTimeProperty(auto_now=True, auto_now_add=True)


# UserItems <-> Tags LINK - User Items have Tags
class ItemTags(ndb.Model):
    user_item        = ndb.KeyProperty(kind=UserItems)
    user_tag         = ndb.KeyProperty(kind=UserTags)


# UserItems <-> Files LINK - User Items have Files
class ItemFiles(ndb.Model):
    user_item        = ndb.KeyProperty(kind=UserItems)
    user_file        = ndb.KeyProperty(kind=UserFiles)
