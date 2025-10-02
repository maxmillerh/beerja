from django.shortcuts import render

from datetime import datetime

def home(request):
    return render(request, 'index_page/index.html'
    )