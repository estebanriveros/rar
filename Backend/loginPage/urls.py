from django.urls import path
from .views import SignUpView, GetCSRFToken, LoginView, LogoutView, EditarUsuarioView, CambiarContrasenaView, CheckAuthenticatedView, recaptcha

urlpatterns = [
    path('authenticated', CheckAuthenticatedView.as_view()),
    path('register', SignUpView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('editar_usuario', EditarUsuarioView.as_view()),
    path('cambiar_contrasena', CambiarContrasenaView.as_view()),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('recaptcha', recaptcha),


]
