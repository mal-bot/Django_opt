from django.core.management.base import BaseCommand
from mainapp.models import Product, ProductCategory
from django.db.models import Q


class Command(BaseCommand):
    def handle(self, *args, **options):
        test_products = Product.objects.filter(
            Q(category__name='офис') |
            Q(category__name__icontains='модерн')
        ).select_related()

        print(len(test_products))
        print(test_products.query)