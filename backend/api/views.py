# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .serializers import APIDataSerializer
# from rest_framework import status
# from .models import userssignin
# # from .serializers import userssignupSerializer
# from rest_framework.permissions import AllowAny

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Route
import json

# RouteView 类，继承自 DRF 的 APIView
class RouteView(APIView):
    permission_classes = [AllowAny]  # 设置权限，允许任何人访问

    def get(self, request):
        """
        从数据库获取所有 Route 数据并返回 JSON 响应
        """
        routes = Route.objects.all()
        route_data = []

        # 遍历每一条记录，将其经纬度和相关数据放入列表
        for route in routes:
            route_data.append({
                "id": route.id,
                "start_lat": route.start_lat,
                "start_lng": route.start_lng,
                "end_lat": route.end_lat,
                "end_lng": route.end_lng,
                "light_intensity": route.light_intensity,
                "crowdedness": route.crowdedness,
                "cleanliness": route.cleanliness
            })

        # 返回数据作为 JSON 响应
        return Response(route_data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        创建新的 Route 对象并保存到数据库
        """
        try:
            # 获取请求中的 JSON 数据
            data = json.loads(request.body)
            
            # 提取数据并进行转换
            start_lat = float(data.get('start_lat'))
            start_lng = float(data.get('start_lng'))
            end_lat = float(data.get('end_lat'))
            end_lng = float(data.get('end_lng'))
            light_intensity = float(data.get('light_intensity'))
            crowdedness = float(data.get('crowdedness'))
            cleanliness = float(data.get('cleanliness'))

            # 创建新的 Route 对象并保存
            route = Route.objects.create(
                start_lat=start_lat,
                start_lng=start_lng,
                end_lat=end_lat,
                end_lng=end_lng,
                light_intensity=light_intensity,
                crowdedness=crowdedness,
                cleanliness=cleanliness
            )

            # 返回成功的响应和新创建的 Route 数据
            return Response({
                "id": route.id,
                "start_lat": route.start_lat,
                "start_lng": route.start_lng,
                "end_lat": route.end_lat,
                "end_lng": route.end_lng,
                "light_intensity": route.light_intensity,
                "crowdedness": route.crowdedness,
                "cleanliness": route.cleanliness
            }, status=status.HTTP_201_CREATED)

        except (TypeError, ValueError, json.JSONDecodeError) as e:
            # 捕获异常并返回 400 错误响应
            return Response({"error": f"Invalid input data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class RouteInfoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        根据起点和终点的经纬度返回所有路径的信息
        """
        try:
            # 获取请求中的数据
            start_lat = request.data.get('start_lat')
            start_lng = request.data.get('start_lng')
            end_lat = request.data.get('end_lat')
            end_lng = request.data.get('end_lng')

            # 校验经纬度数据是否有效
            if not all([start_lat, start_lng, end_lat, end_lng]):
                return Response({"error": "Missing or invalid latitude/longitude data."}, status=status.HTTP_400_BAD_REQUEST)

            # 查询所有匹配的路径
            routes = Route.objects.filter(
                start_lat=start_lat, start_lng=start_lng, end_lat=end_lat, end_lng=end_lng
            )

            if routes.exists():
                route_data = []
                # 返回所有匹配的路径信息
                for route in routes:
                    route_data.append({
                        "light_intensity": route.light_intensity,
                        "crowdedness": route.crowdedness,
                        "cleanliness": route.cleanliness,
                    })
                return Response(route_data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Route not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
