from django.shortcuts import render, get_object_or_404
from .models import Product

def catalog(request):
    # достаём все товары из базы
    products = Product.objects.all()
    return render(request, 'catalog/catalog.html', {'products': products})

def product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'catalog/product.html', {'product': product})
