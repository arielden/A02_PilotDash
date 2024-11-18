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
        fields = ('id', 'part_number', 'indice', 'version', 'designation', 'thickness', 'mass', 'supplier', 'condition', 'part_property')

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

# New Assembly Serializer - Works with the tree view.
class AssemblySerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(write_only=True)
    supplier_name = serializers.CharField(source='supplier.supplier_name', read_only=True)
    sub_assemblies = SubAssemblySerializer(source='assyparent_subassy', many=True, required=False)
    parts = AssemblyPartSerializer(source='assyparent_part', many=True, required=False)
    rmus = AssemblyRmuSerializer(source='assyparent_rmu', many=True, required=False)

    class Meta:
        model = Assembly
        fields = (
            'id', 'assembly_name', 'part_number', 'indice', 'version', 'supplier',
            'supplier_name', 'sub_assemblies', 'parts', 'rmus'
        )

    def validate(self, attrs):
        # Supplier name valitation and object transform.
        supplier_name = attrs.pop('supplier', None)
        if supplier_name:
            try:
                supplier = Supplier.objects.get(supplier_name=supplier_name)
                attrs['supplier'] = supplier
            except Supplier.DoesNotExist:
                raise serializers.ValidationError(f"Supplier '{supplier_name}' does not exist.")
        else:
            raise serializers.ValidationError("Supplier name is required.")
        return attrs

    def update(self, instance, validated_data):
        # Assy updated with validated supplier
        supplier = validated_data.pop('supplier', None)
        if supplier:
            instance.supplier = supplier
        return super().update(instance, validated_data)



# Basic AssemblySerializer, only for SETs
class BasicAssySerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()
    class Meta:
        model = Assembly
        fields = ('id', 'assembly_name', 'part_number', 'indice', 'version', 'supplier')