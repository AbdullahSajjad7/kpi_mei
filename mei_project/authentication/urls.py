from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('password_reset/', views.password_reset, name='password_reset'),
    path('create_password/', views.create_password, name='create_password'),
    path('create_account/', views.create_account, name='create_account'),
    path('home/', views.home, name='home'),
    path('portfolio/', views.portfolio, name='portfolio'),
    path('billing/', views.billing, name='billing'),
    path('resources/', views.resources, name='resources'),
    path('profile/', views.profile, name='profile'),
    path('logout/', views.logout, name='logout'),
]
