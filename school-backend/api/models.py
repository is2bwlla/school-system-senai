from django.db import models
from django.contrib.auth.models import AbstractUser

class Teacher(AbstractUser):
    name = models.CharField(max_length=255, blank=False, null=False)  # Nome completo
    ni = models.CharField(max_length=255, unique=True, blank=False, null=False)  # Número de identificação
    phone = models.CharField(max_length=255, blank=False, null=False)
    position = models.CharField(max_length=255, null=False)  # Cargo
    email = models.EmailField(unique=True, null=False)

    def save(self, *args, **kwargs):
        # Garantir que o 'ni' seja usado como o 'username'
        if not self.username:
            self.username = self.ni  # Definindo o 'username' como 'ni'
        super().save(*args, **kwargs)  # Salva o objeto normalmente

    def __str__(self):
        return self.username
