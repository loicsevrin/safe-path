from rest_framework import serializers
from .models import APIData

class APIDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIData       
        fields = '__all__'    

from .models import Route

# class RouteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Route
#         fields = ['id', 'start_location', 'end_location', 'light_intensity']  # 包含你想要返回的字段
