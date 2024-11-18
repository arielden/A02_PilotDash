from rest_framework import generics

from .models import Part, Assembly, Supplier
from .serializers import PartSerializer, AssemblySerializer, BasicAssySerializer, SupplierSerializer

class PartList(generics.ListCreateAPIView):
    serializer_class = PartSerializer

    def get_queryset(self):
        '''
        GET: Obtiene una lista de todos los registros de Part.
        Permite filtrar los registros por el parámetro condition,
        que se pasa en la URL (por ejemplo, /part/?condition=1).
        '''
        queryset = Part.objects.all()
        condition_param = self.request.query_params.get('condition')
        if condition_param is not None:
            queryset = queryset.filter(condition=condition_param)
        return queryset
    
class PartDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PartSerializer
    queryset = Part.objects.all()

class AssemblyList(generics.ListCreateAPIView):
    serializer_class = BasicAssySerializer
    def get_queryset(self):
        # Filtramos sólo los assy del typo SET
        return Assembly.objects.filter(eng_type=1)

class AssemblyDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AssemblySerializer
    queryset = Assembly.objects.all()

class SupplierList(generics.ListCreateAPIView):
    serializer_class = SupplierSerializer
    def get_queryset(self):
        # Filtramos sólo los assy del typo SET
        return Supplier.objects.all()