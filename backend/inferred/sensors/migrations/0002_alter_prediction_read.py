# Generated by Django 4.2.4 on 2023-08-24 22:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("sensors", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prediction",
            name="read",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="sensors.sensorread"
            ),
        ),
    ]