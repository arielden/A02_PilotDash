from django.urls import path
from .views import PartList, PartDetail, AssemblyList, AssemblyDetail

urlpatterns = [
    path('part/', PartList.as_view()),
    path('part/<int:pk>', PartDetail.as_view()),
    path('assembly/', AssemblyList.as_view()),
    path('assembly/<int:pk>', AssemblyDetail.as_view()),
]