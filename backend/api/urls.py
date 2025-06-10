
from django.urls import path
from .views import RouteView
from .views import RouteInfoView

urlpatterns = [
    path('routes/', RouteView.as_view(), name='routes'),
    path('route-info/', RouteInfoView.as_view(), name='route-info'),
]




