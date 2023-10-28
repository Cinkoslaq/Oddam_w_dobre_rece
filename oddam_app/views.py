from django.views import View
from django.shortcuts import render

class LandingPage(View):
    def get(self, request):
        return render(request, 'landing_page.html')

class AddDonation(View):
    def get(self, request):
        return render(request, 'add_donation.html')

class Login(View):
    def get(self, request):
        return render(request, 'login.html')

class Register(View):
    def get(self, request):
        return render(request, 'register.html')