# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),  # 必须有至少一个 URL 模式
#     # 添加其他路由...
# ]

# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # 包含 API 路由
    # path('users/', include('users.urls')), # 使用 users 里的 urls.py 配置
    path('', views.home, name='home')
]



