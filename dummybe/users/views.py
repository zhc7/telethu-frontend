from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import User, Relationship
from utils.utils_response import *
from utils.utils_require import *

import json


@CheckRequire
@csrf_exempt
def register(req: HttpRequest):
    body = json.loads(req.body)
    print(body)
    if req.method != 'POST':
        return BAD_METHOD


    username = require(body, "userName", "string",
                       err_msg="Missing or error type of [userName]")
    password = require(body, "password", "string",
                       err_msg="Missing or error type of [password]")
    if User.objects.filter(username=username).exists():
        return request_failed(2, "Username already exists", status_code=401)
    if not check_require(username, "username"):
        return request_failed(2, "Invalid username", status_code=422)
    if not check_require(password, "password"):
        return request_failed(2, "Invalid password", status_code=422)
    user = User(username=username, password=password, created_time=timezone.now())
    user.save()
    req.session['user_info'] = user.serialize()
    return JsonResponse({})


@CheckRequire
@csrf_exempt 
def login(req: HttpRequest):
    if req.method != 'POST':
        return BAD_METHOD
    
    body = json.loads(req.body)
    username = require(body, "userName", "string",
                       err_msg="Missing or error type of [userName]")
    password = require(body, "password", "string",
                       err_msg="Missing or error type of [password]")
    
    if not User.objects.filter(username=username, password=password).exists():
        return request_failed(2, "Wrong username or password", status_code=401)

    user = User.objects.get(username=username)

    req.session['user_info'] = user.serialize()

    return request_success()


@CheckRequire
@csrf_exempt
def logout(req: HttpRequest):
    req.session.clear()
    return request_success()


@CheckRequire
@csrf_exempt
def friends_apply(req: HttpRequest):
    user_id = req.session.get('user_info').get('id')
    if req.method == 'GET':
        friend_qlist = User.objects.filter(Q(first_user=user_id) | Q(second_user=user_id))
        return JsonResponse({
            'friends': friend_qlist,
        })
    if req.method == 'POST':
        body = json.loads(req.body)
        to_id = require(body, 'to', 'string')
        met = require(body, 'met', 'int')
        _ = get_object_or_404(User, id=to_id)
        rel_obj = Relationship(first_user=user_id, second_user=to_id, met=met, connected_time=timezone.now())
        rel_obj.save()
        return request_success()

@CheckRequire
@csrf_exempt
def friends_pass(req: HttpResponse):
    user_id = req.session.get('user_info').get('id')
    if req.method == 'POST':
        body = json.loads(req.body)
        applier_id = require(body, 'applier', 'string')
        receiver_id = require(body, 'receiver', 'string')
        if receiver_id != user_id:
            return request_failed(3, 'Forbidden', )

@CheckRequire
@csrf_exempt
def friends_pending(req: HttpResponse):
    pass
