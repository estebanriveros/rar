from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from datetime import datetime, timedelta
from loginPage.models import Usuario, Libro, Transaccion, IntercambiosAvisos
import base64
import os

# OBTENER USUARIO ACTUAL CON LAS COOKIES


def get_user(request):

    session_id = request.COOKIES.get('sessionid')

    try:
        session = Session.objects.get(session_key=session_id)
        user_id = session.get_decoded().get('_auth_user_id')
        user = User.objects.get(pk=user_id)
    except (Session.DoesNotExist, User.DoesNotExist):
        user = None

    return user


class GetUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        user = request.user

        if user.is_authenticated:
            return Response({"message": "Usuario autenticado"})
        else:
            return Response({"message": "Usuario no autenticado"})


class RegistrarLibroView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        user = get_user(request)
        email = Usuario.objects.get(pk=user)

        titulo = data["nombre_libro"]
        numero_paginas = data["numero_paginas"]
        isbn = data["codigo_ISBN"]
        autor = data["nombre_autor"]
        genero = data["genero_libro"]
        estado = data["estado_libro"]
        editorial = data["editorial_libro"]
        ano_publicacion = data["fecha_libro"]
        uso = data["uso_libro"]
        descripcion = data["descripcion_libro"]
        precio_o_intercambio = data["otro_campo"]
        intercambio = None
        precio_venta = None
        precio_renta = None

        if uso == "Venta":
            intercambio = "No"
            precio_venta = precio_o_intercambio
        elif uso == "Renta":
            intercambio = "No"
            precio_renta = precio_o_intercambio
        elif uso == "Intercambio":
            intercambio = precio_o_intercambio

        # Imagen
        cadenab64 = data["file"]
        datos_base64 = cadenab64.split(",")[1]
        imagen_binaria = base64.b64decode(datos_base64)
        partes = str(email.email).split("@")
        nombre_usuario = partes[0] + "@" + partes[1].split(".")[0]
        nombre_imagen = str(titulo) + "-" + nombre_usuario + ".jpg"
        ruta_imagen = '../Frontend/public/static/librosMedia/' + nombre_imagen
        with open(ruta_imagen, 'wb') as archivo_imagen:
            archivo_imagen.write(imagen_binaria)

        # Final
        Libro.objects.create(titulo=titulo, genero=genero, autor=autor, editorial=editorial, isbn=isbn, ano_publicacion=ano_publicacion,
                             numero_paginas=numero_paginas, descripcion=descripcion, estado=estado, intercambio=intercambio, precio_renta=precio_renta, precio_venta=precio_venta, email=email, ruta_imagen=ruta_imagen)

        return Response({'success': "Libro agregado"})


class CatalogoLibrosView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        user = get_user(request)
        email = Usuario.objects.get(pk=user)

        listadolibros = []

        for libro in Libro.objects.all():
            # Verificar si no existe el Libro en Transaccion
            count = Transaccion.objects.filter(id_libro=libro).count()

            if libro.email != email and count == 0:
                uso = None
                if libro.precio_venta is not None:
                    uso = "Venta"
                elif libro.precio_renta is not None:
                    uso = "Renta"
                else:
                    uso = "Intercambio"

                calificacion = 0
                num_calificaciones = 0

                for transaccion in Transaccion.objects.all():
                    if transaccion.id_libro.email == libro.email:
                        if transaccion.calificacion is not None:
                            calificacion += transaccion.calificacion
                            num_calificaciones += 1

                if num_calificaciones > 0:
                    calificacion = round(calificacion / num_calificaciones, 1)

                listadolibros.append(
                    {"idlibro": libro.id_libro, "titulo": libro.titulo, "genero": libro.genero, "autor": libro.autor, "uso": uso, "editorial": libro.editorial, "isbn": libro.isbn, "anoPublicacion": libro.ano_publicacion, "numeroPaginas": libro.numero_paginas, "descripcion": libro.descripcion, "precioVenta": libro.precio_venta, "precioRenta": libro.precio_renta, "intercambio": libro.intercambio, "estado": libro.estado, "vendedorNombre": libro.email.nombre, "vendedorId": libro.email.email, "vendedorCiudad": libro.email.ciudad, "lat": libro.email.latitud, "lng": libro.email.longitud, "calificacion": calificacion})
        print(list(listadolibros))
        return Response({'success': list(listadolibros)})


class ComprarLibroView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        user = get_user(request)

        # DATOS DE COMPRA
        id_comprador = Usuario.objects.get(pk=user)
        id_libro = data["id_libro"]
        tipo_transaccion = "Venta"
        libro = Libro.objects.get(pk=id_libro)
        monto_pagado = libro.precio_venta
        fecha = datetime.now().date()
        print(fecha)

        Transaccion.objects.create(id_comprador=id_comprador, id_libro=libro,
                                   tipo_transaccion=tipo_transaccion, fecha=fecha)

        # DATOS DE ENVIO
        titulo = Libro.objects.get(pk=id_libro).titulo
        direccion = Usuario.objects.get(pk=user).direccion
        mensaje = "Tu pago ha sido aprobado. \n'{}' llegará a tu dirección: {} en máximo 3 a 5 días hábiles".format(
            titulo, direccion)

        return Response({'success': mensaje})


class RentarLibroView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        user = get_user(request)

        # DATOS DE COMPRA
        id_comprador = Usuario.objects.get(pk=user)
        id_libro = data["id_libro"]
        tipo_transaccion = "Renta"
        libro = Libro.objects.get(pk=id_libro)
        fecha_actual = datetime.now().date()

        print(user)
        Transaccion.objects.create(id_comprador=id_comprador, id_libro=libro,
                                   tipo_transaccion=tipo_transaccion, fecha=fecha_actual)

        # DATOS DE ENVIO
        titulo = Libro.objects.get(pk=id_libro).titulo
        direccion = Usuario.objects.get(pk=user).direccion
        fecha_devolucion = fecha_actual + timedelta(days=14)
        fecha_devolucion = fecha_devolucion.strftime("%d de %B de %Y")

        if libro.precio_renta > 0:
            mensaje = "Tu pago ha sido aprobado. \n '{}' llegará a tu dirección: {} en máximo 3 a 5 días hábiles. \nRecuerda regresarlo el día {}".format(
                titulo, direccion, fecha_devolucion)
        else:
            mensaje = "Renta realizada. \n '{}' llegará a tu dirección: {} en máximo 3 a 5 días hábiles. \nRecuerda regresarlo el día {}".format(
                titulo, direccion, fecha_devolucion)

        return Response({'success': mensaje})


class IntercambiarLibroView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        id_libro_vendedor = Libro.objects.get(pk=data["id_libro_vendedor"])
        id_libro_cliente = Libro.objects.get(pk=data["id_libro_cliente"])
        fecha_actual = datetime.now().date()
        estado = "Solicitado"

        IntercambiosAvisos.objects.create(
            id_libro_vendedor=id_libro_vendedor, id_libro_cliente=id_libro_cliente, fecha=fecha_actual, estado=estado)

        libronombrevendedor = id_libro_vendedor.titulo
        libronombrecliente = id_libro_cliente.titulo

        mensaje = "Se ha hecho la solicitud de intercambio de '{}' por tu libro '{}' exitosamente".format(
            libronombrevendedor, libronombrecliente)

        return Response({'success': mensaje})


class AceptarIntercambioView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        id_aviso = IntercambiosAvisos.objects.get(pk=data["id_aviso"])
        print(id_aviso)
        titulo_libro_cliente = id_aviso.id_libro_cliente.titulo
        titulo_libro_usuario = id_aviso.id_libro_vendedor.titulo
        direccion = id_aviso.id_libro_vendedor.email.direccion
        direccion_cliente = id_aviso.id_libro_cliente.email.direccion
        id_cliente = id_aviso.id_libro_cliente.email
        id_usuario = id_aviso.id_libro_vendedor.email
        id_libro_cliente = id_aviso.id_libro_cliente
        id_libro_usuario = id_aviso.id_libro_vendedor
        tipo_transaccion = "Intercambio"
        fecha_actual = datetime.now().date()
        estado = "Aceptado"

        IntercambiosAvisos.objects.filter(id_aviso=data["id_aviso"]).update(
            fecha=fecha_actual, estado=estado)

        Transaccion.objects.create(id_comprador=id_cliente, id_libro=id_libro_usuario,
                                   tipo_transaccion=tipo_transaccion, fecha=fecha_actual, id_aviso=id_aviso)
        Transaccion.objects.create(id_comprador=id_usuario, id_libro=id_libro_cliente,
                                   tipo_transaccion=tipo_transaccion, fecha=fecha_actual, id_aviso=id_aviso)

        mensaje = "¡Aceptaste el intercambio!. \n'{}' llegará a tu dirección: {} en máximo 3 a 5 días hábiles. \n -> Recuerda hacer el envío de tu libro '{}' a la dirección {}".format(
            titulo_libro_cliente, direccion, titulo_libro_usuario, direccion_cliente)

        return Response({'success': mensaje})


class DenegarIntercambioView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        fecha_actual = datetime.now().date()
        estado = "Cancelado"

        IntercambiosAvisos.objects.filter(id_aviso=data["id_aviso"]).update(
            fecha=fecha_actual, estado=estado)

        mensaje = "Solicitud de intercambio cancelada"

        return Response({'success': mensaje})


class AvisosIntercambiosView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        user = get_user(request)

        usuario = Usuario.objects.get(pk=user)

        listaintercambios = []

        for aviso in IntercambiosAvisos.objects.all():
            if aviso.id_libro_vendedor.email == usuario:
                idlibrousuario = aviso.id_libro_vendedor.id_libro
                imagencliente = os.path.basename(
                    aviso.id_libro_vendedor.ruta_imagen)
                titulolibrousuario = aviso.id_libro_vendedor.titulo
                idlibrocliente = aviso.id_libro_cliente.id_libro
                imagenusuario = os.path.basename(
                    aviso.id_libro_cliente.ruta_imagen)
                titulolibrocliente = aviso.id_libro_cliente.titulo
                emailcliente = aviso.id_libro_cliente.email.email
                emailusuario = aviso.id_libro_vendedor.email.email
                estado = aviso.estado
                id_aviso = aviso.id_aviso

                listaintercambios.append(
                    {"idlibrousuario": idlibrousuario, "titulolibrousuario": titulolibrousuario, "idlibrocliente": idlibrocliente, "titulolibrocliente": titulolibrocliente, "estado": estado, "idaviso": id_aviso, "imagenvendedor": imagenusuario, "imagencliente": imagencliente, "emailcliente": emailcliente, "emailusuario": emailusuario})
            elif aviso.id_libro_cliente.email == usuario:
                idlibrocliente = aviso.id_libro_vendedor.id_libro
                titulolibrocliente = aviso.id_libro_vendedor.titulo

                idlibrousuario = aviso.id_libro_cliente.id_libro
                titulolibrousuario = aviso.id_libro_cliente.titulo
                imagenusuario = os.path.basename(
                    aviso.id_libro_vendedor.ruta_imagen)
                imagencliente = os.path.basename(
                    aviso.id_libro_cliente.ruta_imagen)
                emailcliente = aviso.id_libro_cliente.email.email
                emailusuario = aviso.id_libro_vendedor.email.email
                estado = aviso.estado
                id_aviso = aviso.id_aviso

                if estado == "Solicitado":
                    estado = "Solicitud enviada"

                listaintercambios.append(
                    {"idlibrousuario": idlibrousuario, "titulolibrousuario": titulolibrousuario, "idlibrocliente": idlibrocliente, "titulolibrocliente": titulolibrocliente, "estado": estado, "idaviso": id_aviso, "imagenvendedor": imagenusuario, "imagencliente": imagencliente, "emailcliente": emailcliente, "emailusuario": emailusuario})

        return Response({'success': list(listaintercambios)})


class PerfilVendedorView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        id_libro = data["id_libro"]
        vendedor = Libro.objects.get(pk=id_libro).email
        nombre = vendedor.nombre
        telefono = vendedor.telefono
        ciudad = vendedor.ciudad
        direccion = vendedor.direccion
        avatar = vendedor.avatar
        calificacion = 0
        num_calificaciones = 0

        for transaccion in Transaccion.objects.all():
            if transaccion.id_libro.email == vendedor:
                if transaccion.calificacion is not None:
                    calificacion += transaccion.calificacion
                    num_calificaciones += 1

        if num_calificaciones > 0:
            calificacion = round(calificacion / num_calificaciones, 1)

        return Response({"nombre": nombre, "telefono": telefono, "ciudad": ciudad, "direccion": direccion, "avatar": avatar, "calificacion": calificacion})


class CalificacionTransaccionView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        data = self.request.data

        calificacion = data["calificacion"]

        Transaccion.objects.filter(id_transaccion=data["id_transaccion"]).update(
            calificacion=calificacion)

        return Response({'success': "Calificado"})


class HistorialCompras(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        user = get_user(request)
        email = Usuario.objects.get(pk=user)
        listadoCompras = []
        calificacion = 0

        for compra in Transaccion.objects.all():
            if compra.id_comprador == email:
                libro = Libro.objects.get(pk=compra.id_libro.id_libro)

                calificacion = 0
                num_calificaciones = 0
                if compra.calificacion is not None:
                    calificacion = compra.calificacion

                # for transaccion in Transaccion.objects.all():
                #     if transaccion.id_libro.email == compra.id_libro.email:
                #         if transaccion.calificacion is not None:
                #             calificacion += transaccion.calificacion
                #             num_calificaciones += 1

                # if num_calificaciones > 0:
                #     calificacion = round(calificacion / num_calificaciones, 1)

                listadoCompras.append(
                    {"idTransaccion": compra.id_transaccion, "tipoTransaccion": compra.tipo_transaccion, "nombreLibro": libro.titulo, "genero": libro.genero, "autor": libro.autor,  "vendedor": libro.email.nombre, "vendedorId": libro.email.email, "imagen": libro.ruta_imagen, "calificacion": calificacion})

        print(list(listadoCompras))
        return Response({'success': list(listadoCompras)})


class LibrosParaTransacciones(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        user = get_user(request)
        email = Usuario.objects.get(pk=user)
        idlibrosDisponibles = Libro.objects.filter(email=email.email) \
            .exclude(id_libro__in=Transaccion.objects.values_list('id_libro', flat=True)) \
            .values_list('id_libro', flat=True)
        infoLibro = Libro.objects.filter(id_libro__in=idlibrosDisponibles)
        librosDisponibles = []
        for libro in infoLibro:
            librosDisponibles.append(
                {"idLibro": libro.id_libro, "titulo": libro.titulo, "genero": libro.genero, "autor": libro.autor, "estado": libro.estado, "imagen": libro.ruta_imagen})

        print(list(librosDisponibles))
        return Response({'success': list(librosDisponibles)})


class MisLibrosVendidos(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):

        user = get_user(request)
        email = Usuario.objects.get(pk=user)
        listadoVentas = []

        for venta in Transaccion.objects.all():
            if venta.id_libro.email == email:
                libro = Libro.objects.get(pk=venta.id_libro.id_libro)
                listadoVentas.append(
                    {"idTransaccion": venta.id_transaccion, "tipoTransaccion": venta.tipo_transaccion,  "nombreLibro": libro.titulo,  "comprador": venta.id_comprador.nombre, "imagen": os.path.basename(libro.ruta_imagen)})

        print(list(listadoVentas))
        return Response({'success': list(listadoVentas)})
