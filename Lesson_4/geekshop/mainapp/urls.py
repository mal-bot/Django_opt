from django.urls import path, re_path

import mainapp.views as mainapp

app_name = 'mainapp'

urlpatterns = [
    path('', mainapp.products, name='index'),
    path('category/<int:pk>/', mainapp.products, name='category'),
    path('category/<int:pk>/page/<int:page>/', mainapp.products, name='page'),
    path('product/<int:pk>/', mainapp.product, name='product'),
    re_path(r'^product/(?P<name>[\w\d\s]+)/price/$', mainapp.get_product_price),
    # path('product/<int:pk>/price/', mainapp.get_product_price),
]
