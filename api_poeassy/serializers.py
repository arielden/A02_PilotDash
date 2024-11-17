from rest_framework import serializers
from .models import Part, Assembly, AssemblyPart, Rmu, AssemblyRmu, AssemblySubAssembly, Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ('id', 'supplier_name')

class PartSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()
    class Meta:
        model = Part
        fields = ('id', 'part_number', 'designation', 'thickness', 'mass', 'supplier', 'condition', 'part_property')

class RmuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rmu
        fields = ('id', 'part_number', 'designation', 'mass')

class AssemblyPartSerializer(serializers.ModelSerializer):
    part = PartSerializer()
    class Meta:
        model = AssemblyPart
        fields = ('part', 'coef')

class AssemblyRmuSerializer(serializers.ModelSerializer):
    rmu = RmuSerializer()
    class Meta:
        model = AssemblyRmu
        fields = ('rmu', 'coef')

# Use SubAssemblyDetailSerializer to unify sub-assembly representation
class SubAssemblyDetailSerializer(serializers.ModelSerializer):
    parts = AssemblyPartSerializer(source='assyparent_part', many=True)
    rmus = AssemblyRmuSerializer(source='assyparent_rmu', many=True)
    sub_assemblies = serializers.SerializerMethodField()

    class Meta:
        model = Assembly
        fields = ('id', 'assembly_name', 'part_number', 'indice', 'version', 'eng_type', 'parts', 'rmus', 'sub_assemblies')

    def get_sub_assemblies(self, obj):
        # Fetch related sub-assemblies
        sub_assemblies = AssemblySubAssembly.objects.filter(parent_assembly=obj)
        return SubAssemblySerializer(sub_assemblies, many=True).data

class SubAssemblySerializer(serializers.ModelSerializer):
    sub_assembly = SubAssemblyDetailSerializer()
    coef = serializers.IntegerField()
    
    class Meta:
        model = AssemblySubAssembly
        fields = ('sub_assembly', 'coef')

# Main AssemblySerializer
class AssemblySerializer(SubAssemblyDetailSerializer):
    sub_assemblies = SubAssemblySerializer(source='assyparent_subassy', many=True, required=False)
    parts = AssemblyPartSerializer(source='assyparent_part', many=True, required=False)
    rmus = AssemblyRmuSerializer(source='assyparent_rmu', many=True, required=False)

# Basic AssemblySerializer, only for SETs
class BasicAssySerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()
    class Meta:
        model = Assembly
        fields = ('id', 'assembly_name', 'part_number', 'indice', 'version', 'supplier')

