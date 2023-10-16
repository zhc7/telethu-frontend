from django.db import models
import secrets

class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=32, unique=True)
    password = models.CharField(max_length=128)
    avatar = models.CharField(max_length=256,
                              default="https://images.unsplash.com/photo-1642921131008-b13897b36d17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUU2JUI4JTg1JUU1JThEJThFJUU1JUE0JUE3JUU1JUFEJUE2fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60")
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        pass

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "created_time": str(self.created_time),
            "avatar": self.avatar,
        }

    def __str__(self):
        return self.username

    def generate_token(self):
        token = secrets.token_hex(32)
        self.token = token
        self.save()
        return token
    
class Relationship(models.Model):
    first_user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='rel_first')
    secend_user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='rel_second')
    connected_time = models.DateTimeField()
    met_choices = (
        (0, 'Id'),
        (1, 'Phone'),
        (2, 'Email'),
        (3, 'Group'),
        (4, 'QRCode'),
    )
    met = models.IntegerField(choices=met_choices)
    state_choices = (
        (0, 'Requested'),
        (1, 'Valid'),
        (2, 'Deleted'),
    )
    state = models.IntegerField(choices=state_choices, default=0)
    mute1 = models.BooleanField(default=False)
    mute2 = models.BooleanField(default=False)

class Block(models.Model):
    first_user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='block_first')
    second_user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='block_second')
    state_choices = (
        (0, 'Valid'),
        (1, 'Expired'),
    )
    state = models.IntegerField(choices=state_choices)
    time = models.DateTimeField(auto_now_add=True)