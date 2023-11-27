from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib import auth
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from loginPage.models import Usuario, Libro, Transaccion
import geocoder
import random
import requests  # npm i requests [si sale error]

# Creatme your views here.


@method_decorator(csrf_protect, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):

        try:
            isAuthenticated = Usuario.is_authenticated
            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})
            else:
                return Response({'isAuthenticated': 'error'})
        except:
            return Response({'error': 'Error al autenticar'})

# CLASE PARA REGISTRO DE NUEVOS USUARIOS


@method_decorator(csrf_protect, name='dispatch')
class SignUpView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):

        data = self.request.data

        tipo_documento = data['tipo_documento']
        cedula = data['cedula']
        nombre = data['nombre']
        email = data['email']
        contrasena = data['contrasena']
        contrasena_re = data['contrasena_re']
        telefono = data['telefono']
        ciudad = data['ciudad']
        direccion = data['direccion']

        if contrasena == contrasena_re:
            if Usuario.objects.filter(cedula=cedula).exists():
                return Response({'error': 'Ya existe una cuenta asociada a esta cédula'})
            else:
                if Usuario.objects.filter(email=email).exists():
                    return Response({'error': 'Este correo electrónico ya está en uso'})
                else:
                    if len(contrasena) < 4:
                        return Response({'error': 'La contraseña es muy corta'})
                    else:
                        localizacion = geocoder.osm(
                            direccion+","+ciudad+', Colombia')
                        # coordenadas = localizacion.latlng
                        latitud = localizacion.latlng[0]
                        longitud = localizacion.latlng[1]
                        avatar = random.randint(1, 24)
                        user = User.objects.create_user(
                            username=email, password=contrasena)

                        Usuario.objects.create(email=email, cedula=cedula, nombre=nombre, telefono=telefono,
                                               ciudad=ciudad, direccion=direccion, tipo_documento=tipo_documento, latitud=latitud, longitud=longitud, avatar=avatar)
                        return Response({'success': 'El usuario ha sido creado'})
        else:
            return Response({'error': 'Las contraseñas no coinciden'})
        
@ method_decorator(ensure_csrf_cookie, name='dispatch')
@ method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):

        # try:

        data = self.request.data

        username = data['email']
        password = data['contrasena']

        user = auth.authenticate(username=username, password=password)
        print(user)
        email = None
        nombre = None
        tipoDocumento = None
        cedula = None
        telefono = None
        ciudad = None
        direccion = None

        lista_libros_coordenadas = []

        if user is not None:
            auth.login(request, user)

            usuario = Usuario.objects.get(pk=data['email'])
            email = usuario.email
            nombre = usuario.nombre
            tipoDocumento = usuario.tipo_documento
            cedula = usuario.cedula
            telefono = usuario.telefono
            ciudad = usuario.ciudad
            direccion = usuario.direccion
            latitud = usuario.latitud
            longitud = usuario.longitud
            avatar = usuario.avatar

            for libro in Libro.objects.all():
                if libro.email != usuario:
                    nombre_libro = libro.titulo
                    id_libro = libro.id_libro
                    lista_libros_coordenadas.append(
                        {"lat": libro.email.latitud, "lng": libro.email.longitud, "nombre_libro": nombre_libro, "id_libro": id_libro})

            print(lista_libros_coordenadas)
            calificacion = 0
            num_calificaciones = 0

            for transaccion in Transaccion.objects.all():
                if transaccion.id_libro.email == usuario:
                    if transaccion.calificacion is not None:
                        calificacion += transaccion.calificacion
                        num_calificaciones += 1

            if num_calificaciones > 0:
                calificacion = round(calificacion / num_calificaciones, 1)

            return Response({'success': "Usuario autenticado exitosamente", "email": email, "nombre": nombre, "tipoDocumento": tipoDocumento, "cedula": cedula, "telefono": telefono, "ciudad": ciudad, "direccion": direccion, "latitud": latitud, "longitud": longitud, "listaCoordenadas": lista_libros_coordenadas, "avatar": avatar, "calificacion": calificacion})
        else:
            return Response({'error': 'Usuario y/o contraseña incorrectas'})
        # except:
        #     return Response({'error': 'Usuario no existe, o credenciales incorrectas'})


class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'Sesión cerrada'})
        except:
            return Response({'error': 'Error al cerrar sesión'})


class EditarUsuarioView(APIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        data = self.request.data

        username = data['email']
        nombre = data['nombre']
        telefono = data['telefono']
        tipo_documento = data['tipo_documento']
        cedula = data['cedula']
        Usuario.objects.filter(
            email=username).update(nombre=nombre, telefono=telefono, tipo_documento=tipo_documento)
        if Usuario.objects.get(pk=cedula).estado_usuario == "activo":
            Usuario.objects.filter(cedula=cedula).update(
                estado_usuario="inactivo")
        else:
            Usuario.objects.filter(cedula=cedula).update(
                estado_usuario="activo")
        return Response({'success': 'Se han actualizado los datos'})


class CambiarContrasenaView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        username = data['email']
        contrasena_antigua = data['contrasena_antigua']
        contrasena_nueva = data['contrasena_nueva']
        contrasena_re = data['contrasena_re']

        user = auth.authenticate(
            username=username, password=contrasena_antigua)

        print(user)
        if user is not None:
            if contrasena_nueva == contrasena_re:
                if len(contrasena_nueva) < 4:
                    return Response({'error': 'La contraseña es muy corta'})
                else:
                    user.set_password(contrasena_nueva)
                    user.save()
                    return Response({'success': 'Se ha cambiado la contraseña'})
            else:
                return Response({'error': 'No coinciden las contraseñas'})
        else:
            return Response({'error': 'La contraseña antigua no es correcta'})


@ method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([])
@authentication_classes([])
def recaptcha(request):
    r = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': '6Lf5qt8jAAAAAL5ptnOhgc28SkxYxcwNGHdgVtQr',
            'response': request.data['captcha_value'],
        }
    )

    return Response({'captcha': r.json()})
