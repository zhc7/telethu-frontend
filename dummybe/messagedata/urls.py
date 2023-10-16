from django.urls import path
from messagedata import views

app_name = 'messagedata'

urlpatterns = [
    path('person', views.messages_person),
]
