from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, HttpResponseForbidden, HttpResponse
from django.utils.deprecation import MiddlewareMixin
from utils.utils_response import *


class AuthMiddleWare(MiddlewareMixin):
    no_login_urls = ['/api/users/login', '/api/usrs/logout', '/api/users/register']
    def process_request(self, request):
        if not request.path_info.startswith('/api'):
            return None
        if request.path_info in self.no_login_urls:
            return None
        user_info = request.session.get('user_info')
        if user_info is None:
            return request_failed(2, "Invalid Token", status_code=401)

    def process_response(self, request, response):
        return response