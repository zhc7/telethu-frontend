from django.db import models
from users.models import User

class Message(models.Model):
    sender = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='receiver')
    time = models.DateTimeField()
    state_choice = (
        (0, 'Pending'),
        (1, 'Sent'),
        (2, 'Read'),
    )
    state = models.IntegerField(choices=state_choice)