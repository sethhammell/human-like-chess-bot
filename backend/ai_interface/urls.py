from django.urls import path
from . import views

urlpatterns = [
    path("", views.welcome, name="welcome"),
    path("get_move/<path:fen>/<int:max_depth>/", views.get_move, name="get_move"),
]
