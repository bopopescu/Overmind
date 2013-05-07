from django.conf.urls.defaults import patterns

urlpatterns = patterns('',

    # index
    (r'^$', 'overmind.views.index'),

    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # Overmind REST API
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    # USERS
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^user/login/$', 'overmind.users.views.login'),
    (r'^user/$', 'overmind.users.views.createUser'),

    # USER ITEMS
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^user_item/$', 'overmind.items.views.getUserItems'),
    (r'^user_item/create/$', 'overmind.items.views.addUserItem'),

    # FILES
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^upload/base64/$', 'overmind.files.views.uploadBase64File'),


    # USER FILES
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^user/files/$', 'overmind.files.views.getUserFiles'),


    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # admin
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (r'^key/$', 'overmind.management.views.setAPIKey'),

    # catch all
    (r'^.*/$', 'overmind.views.index'),
)
