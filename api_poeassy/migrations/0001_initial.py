# Generated by Django 4.2.16 on 2024-11-03 13:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assembly',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assembly_name', models.CharField(max_length=255)),
                ('part_number', models.CharField(max_length=50)),
                ('indice', models.CharField(max_length=50)),
                ('version', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Condition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='EngType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Rmu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('part_number', models.CharField(max_length=50)),
                ('designation', models.CharField(max_length=255, unique=True)),
                ('mass', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('supplier_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('material', models.CharField(max_length=50)),
                ('protection', models.CharField(max_length=50)),
            ],
            options={
                'unique_together': {('material', 'protection')},
            },
        ),
        migrations.CreateModel(
            name='Part',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('part_number', models.CharField(max_length=50)),
                ('indice', models.CharField(max_length=50)),
                ('version', models.IntegerField()),
                ('designation', models.CharField(max_length=255)),
                ('thickness', models.FloatField()),
                ('mass', models.FloatField()),
                ('condition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.condition')),
                ('part_property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.property')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.supplier')),
            ],
        ),
        migrations.CreateModel(
            name='AssemblySubAssembly',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coef', models.IntegerField(default=1)),
                ('parent_assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assyparent_subassy', to='api_poeassy.assembly')),
                ('sub_assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.assembly')),
            ],
        ),
        migrations.CreateModel(
            name='AssemblyRmu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coef', models.IntegerField(default=1)),
                ('assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assyparent_rmu', to='api_poeassy.assembly')),
                ('rmu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.rmu')),
            ],
        ),
        migrations.CreateModel(
            name='AssemblyPart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coef', models.IntegerField(default=1)),
                ('assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assyparent_part', to='api_poeassy.assembly')),
                ('part', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.part')),
            ],
        ),
        migrations.AddField(
            model_name='assembly',
            name='eng_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.engtype'),
        ),
        migrations.AddField(
            model_name='assembly',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_poeassy.supplier'),
        ),
    ]