from django.shortcuts import render, get_object_or_404

from indigo_api.models import Document
from indigo_app.models import Language, Subtype, Country
from .forms import DocumentForm
import json


def document(request, doc_id):
    doc = get_object_or_404(Document, pk=doc_id)
    form = DocumentForm(instance=doc)
    return render(request, 'document/show.html', {
        'document': doc,
        'form': form,
        'subtypes': Subtype.objects.order_by('name').all(),
        'languages': Language.objects.all(),
        'countries': Country.objects.all(),
        'view': 'DocumentView',
    })


def new_document(request):
    doc = Document(title='(untitled)')
    form = DocumentForm(instance=doc)
    return render(request, 'document/show.html', {
        'document': doc,
        'form': form,
        'view': 'DocumentView',
    })


def import_document(request):
    doc = Document(frbr_uri='/')
    form = DocumentForm(instance=doc)
    return render(request, 'import.html', {
        'document': doc,
        'form': form,
        'view': 'ImportView',
    })


def library(request):
    countries = {c.country.iso.lower(): c.country.name for c in Country.objects.all()}
    countries_json = json.dumps(countries)

    return render(request, 'library.html', {
        'countries_json': countries_json,
        'view': 'LibraryView',
    })


def password_reset_confirm(request, uidb64, token):
    return render(request, 'user/password_reset_confirm.html', {
        'uid': uidb64,
        'token': token,
    })
