# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-07-07 12:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('viewflow', '0006_i18n'),
        ('indigo_api', '0053_work_view_perm'),
        ('indigo_workflow', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewWorkProcess',
            fields=[
                ('process_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='viewflow.Process')),
                ('work', models.ForeignKey(help_text=b'Work to review', on_delete=django.db.models.deletion.CASCADE, related_name='review_work_tasks', to='indigo_api.Work')),
            ],
            options={
                'abstract': False,
            },
            bases=('viewflow.process',),
        ),
    ]
