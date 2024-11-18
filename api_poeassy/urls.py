from django.urls import path
from .views import PartList, PartDetail, AssemblyList, AssemblyDetail, SupplierList

urlpatterns = [
    path('part/', PartList.as_view()),
    path('part/<int:pk>', PartDetail.as_view()),
    path('assembly/', AssemblyList.as_view()),
    path('assembly/<int:pk>', AssemblyDetail.as_view()),
    path('supplier/', SupplierList.as_view()),
]