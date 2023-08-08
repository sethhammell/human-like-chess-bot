from django.http import HttpResponse
from django.views.decorators.http import require_GET


@require_GET
def base_welcome(request):
    return HttpResponse("<h1>Welcome to Human-like Chess Bot!</h1>")
