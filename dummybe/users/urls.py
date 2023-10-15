from django.urls import path
from .views import login, logout, register, friends_apply, friends_pass, friends_pending

app_name = 'users'

urlpatterns = [
    path('login', login),
    path('logout', logout),
    path('register', register),
    path('friends/apply', friends_apply),
    path('friend/pass', friends_pass),
    path('friends/pending', friends_pending),
]