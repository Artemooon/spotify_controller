# Generated by Django 3.1.4 on 2021-01-12 21:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_roomuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='roomuser',
            name='room',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.room'),
        ),
        migrations.AlterField(
            model_name='roomuser',
            name='name',
            field=models.CharField(blank=True, max_length=30, unique=True),
        ),
    ]