from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

class Institution(models.Model):
    TYPE_CHOICES = [
        ('1', 'Fundacja'),
        ('2', 'Organizacja pozarządowa'),
        ('3', 'Zbiórka lokalna'),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='1')
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Instytucja"
        verbose_name_plural = "Instytucje"

class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Donation: {self.quantity} worków for {self.institution} on {self.pick_up_date}"

