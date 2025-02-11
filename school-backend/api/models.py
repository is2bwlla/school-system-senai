from django.db import models
from django.contrib.auth.models import AbstractUser         #Modelo de usuário abstrato do django


class Teacher(AbstractUser):
    name = models.CharField(max_length=255, blank=True, null=True)  # Full name
    ni = models.CharField(max_length=15, unique=True, blank=True, null=True)  # Identify number
    phone = models.CharField(max_length=15, blank=True, null=True)
    position = models.CharField(max_length=255)  
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
