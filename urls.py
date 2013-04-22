from django.conf.urls.defaults import patterns


urlpatterns = patterns('',

    # index
    (r'^$', 'overmind.views.index'),

    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # gamedex rest api
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # user
    #(r'^user/login/$',                  'overmind.user.login'),


    # upload
    (r'^upload/$', 'overmind.views.upload'),

    # catch all
    #(r'^.*/$', 'overmind.views.index'),
)
