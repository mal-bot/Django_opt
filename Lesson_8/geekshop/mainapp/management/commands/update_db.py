from django.core.management.base import BaseCommand
from mainapp.models import ProductCategory, Product
from authapp.models import ShopUser, ShopUserProfile

import json, os


class Command(BaseCommand):
    help = 'Fill DB new data'

    def handle(self, *args, **options):
        users = ShopUser.objects.all()
        for user in users:
            user_profile = ShopUserProfile.objects.create(user=user)
            user_profile.save()
