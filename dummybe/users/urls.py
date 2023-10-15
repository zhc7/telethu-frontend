from django.urls import path
from .views import login, logout, register, friends_apply, friends_pass, friends_reject, friends_block, friends_unblock

app_name = 'users'

urlpatterns = [
    path('login', login),
    path('logout', logout),
    path('register', register),
    path('friends/apply', friends_apply),
    path('friend/pass', friends_pass),
    path('friends/reject', friends_reject),
    path('friends/block', friends_block),
    path('friends/unblock', friends_unblock),
]