# main_config/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'index.html')  # 渲染 index.html 模板
