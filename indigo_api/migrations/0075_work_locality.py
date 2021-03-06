# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-08 09:52
from __future__ import unicode_literals
import re

from django.db import migrations, models
import django.db.models.deletion

locality_re = re.compile('^/[a-z]{2}-([^/]+)/')


def populate_locality_obj(apps, schema_editor):
    Work = apps.get_model("indigo_api", "Work")
    db_alias = schema_editor.connection.alias

    for work in Work.objects.using(db_alias).all():
        match = locality_re.match(work.frbr_uri)
        if match:
            code = match.groups()[0]
            work.locality = work.country.localities.filter(code=code).first()
            if not work.locality:
                raise ValueError("Couldn't find a locality %s for country %s" % (code, work.country))
            work.save()


class Migration(migrations.Migration):

    dependencies = [
        ('indigo_api', '0074_document_view_source_perm'),
    ]

    operations = [
        migrations.AddField(
            model_name='work',
            name='locality',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='indigo_api.Locality'),
        ),
        migrations.RunPython(populate_locality_obj, migrations.RunPython.noop),
    ]
