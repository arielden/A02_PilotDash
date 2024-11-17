from django.db import models

# Create your models here.
class Supplier(models.Model):
    supplier_name = models.CharField(max_length=255)
    def __str__(self) -> str:
        return self.supplier_name

class EngType(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self) -> str:
        return self.name

class Condition(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Property(models.Model):
    material = models.CharField(max_length=50)
    protection = models.CharField(max_length=50)

    class Meta:
        unique_together = ('material', 'protection')
    def __str__(self) -> str:
        return f"{self.material}-{self.protection}"

class Assembly(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    assembly_name = models.CharField(max_length=255)
    part_number = models.CharField(max_length=50)
    indice = models.CharField(max_length=50)
    version = models.IntegerField()
    eng_type = models.ForeignKey(EngType, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.assembly_name

class Part(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    part_number = models.CharField(max_length=50)
    indice = models.CharField(max_length=50)
    version = models.IntegerField()
    designation = models.CharField(max_length=255)
    thickness = models.FloatField()
    mass = models.FloatField()
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE)
    part_property = models.ForeignKey(Property, on_delete=models.CASCADE)

    def __str__(self):
        return self.designation

class Rmu(models.Model):
    part_number = models.CharField(max_length=50)
    designation = models.CharField(max_length=255, unique=True)
    mass = models.FloatField()

    def __str__(self):
        return self.designation

class AssemblyRmu(models.Model):
    assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, related_name='assyparent_rmu')
    rmu = models.ForeignKey(Rmu, on_delete=models.CASCADE)
    coef = models.IntegerField(default=1)

class AssemblyPart(models.Model):
    assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, related_name='assyparent_part')
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    coef = models.IntegerField(default=1)

class AssemblySubAssembly(models.Model):
    parent_assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, related_name='assyparent_subassy')
    sub_assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE)
    coef = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.parent_assembly.assembly_name} -> {self.sub_assembly.assembly_name}"