from django.db import models

class APIData(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_data'
    

# from django.contrib.gis.db import models  # 导入 GIS 模型

from django.db import models


class Route(models.Model):
    start_lat = models.FloatField()  # 存储起始点的纬度
    start_lng = models.FloatField()  # 存储起始点的经度
    end_lat = models.FloatField()    # 存储终点的纬度
    end_lng = models.FloatField()    # 存储终点的经度
    light_intensity = models.FloatField()  # 存储光强度
    crowdedness = models.FloatField()
    cleanliness = models.FloatField()

    class Meta:
        db_table = 'map'  # 将表名设置为 'map'

    def __str__(self):
        return f"Route from ({self.start_lat}, {self.start_lng}) to ({self.end_lat}, {self.end_lng})"
