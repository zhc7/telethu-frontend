from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, Http404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import Message
from utils.utils_response import *
from utils.utils_require import *

import json

@CheckRequire
@csrf_exempt
def messages_person(req: HttpRequest):
    user_id = req.session.get('user_info').get('id')
    if req.method == 'POST':
        body = json.loads(req.body)
        if user_id != body.sender:
            return request_failed(2, 'Forbidden', 403)
        message_obj = Message(sender=body.sender, receiver=body.receiver, time=timezone.now(), state=1)
        message_obj.save()
    if req.method == 'GET':
        query = req.GET
        first_user = require(query, 'first_user', 'string', 'Bad field [user1]')
        second_user = require(query, 'user2', 'string', 'bad field [user2]')
        if user_id != first_user and user_id != second_user:
            return request_failed(2, 'Forbidden', 403)
        message_qlist = Message.objects.filter((Q(sender=first_user) & Q(receiver=second_user)) | (Q(sender=second_user) & Q(receiver=first_user)))
        return JsonResponse({
            'messages': message_qlist,
        })