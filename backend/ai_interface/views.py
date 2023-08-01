from django.http import HttpResponse


def welcome(request):
    return HttpResponse("<h1>Welcome to Human-like Chess Bot!</h1>")
