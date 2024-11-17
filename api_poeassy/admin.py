from django.contrib import admin
from .models import Supplier, EngType, Condition, Property, Assembly, Part, Rmu

# Register your models here.
admin.site.register(Supplier)
admin.site.register(EngType)
admin.site.register(Condition)
admin.site.register(Property)
admin.site.register(Assembly)
admin.site.register(Part)
admin.site.register(Rmu)