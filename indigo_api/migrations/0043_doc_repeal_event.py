# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-04-08 10:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('indigo_api', '0042_add_repeal_works'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='repeal_event',
        ),
    ]
