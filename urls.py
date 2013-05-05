from django.conf.urls.defaults import patterns

urlpatterns = patterns('',

    # index
    (r'^$', 'overmind.views.index'),

    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # Overmind REST API
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # users
    (r'^user/login/$', 'overmind.users.views.login'),
    (r'^user/$', 'overmind.users.views.create_user'),


    # upload
    (r'^upload/$', 'overmind.views.upload'),

    # catch all
    #(r'^.*/$', 'overmind.views.index'),
)
