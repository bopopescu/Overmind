from django.conf.urls.defaults import patterns

urlpatterns = patterns('',

    # index
    (r'^$', 'overmind.views.index'),

    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # Overmind REST API
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    # USERS
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^api/user/login/$', 'overmind.users.views.login'),
    (r'^api/user/$', 'overmind.users.views.createUser'),

    # USER ITEMS
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^api/user/items/$', 'overmind.items.views.getUserItems'),
    (r'^api/user/item/create/$', 'overmind.items.views.createUserItem'),
    (r'^api/user/item/(?P<itemID>[\w\d-]+)/$', 'overmind.items.views.getUserItem'),
    (r'^api/user/item/(?P<itemID>[\w\d-]+)/update/$', 'overmind.items.views.updateUserItem'),

    # USER TAGS
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^api/user/tags/$', 'overmind.tags.views.getUserTags'),

    # USER FILES
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^api/user/files/$', 'overmind.files.views.getUserFiles'),

    # FILES
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^api/files/upload/base64/$', 'overmind.files.views.uploadBase64File'),

    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # admin
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^key/$', 'overmind.management.views.setAPIKey'),

    # catch all - for html 5 urls
    (r'^.*/$', 'overmind.views.index'),
)