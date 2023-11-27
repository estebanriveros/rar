# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey(
        'DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Usuario(models.Model):
    cedula = models.CharField(max_length=100)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    email = models.CharField(primary_key=True, max_length=100)
    ciudad = models.CharField(max_length=100)
    direccion = models.CharField(max_length=100)
    tipo_documento = models.CharField(max_length=100)
    latitud = models.CharField(max_length=100)
    longitud = models.CharField(max_length=100)
    avatar = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'usuario'

    def __str__(self):
        return f"{self.cedula}, {self.nombre}, {self.telefono}, {self.email}, {self.tipo_documento}, {self.latitud},{self.longitud}"


class Libro(models.Model):
    id_libro = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=100)
    genero = models.CharField(max_length=100)
    autor = models.CharField(max_length=100)
    editorial = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    isbn = models.CharField(max_length=100)
    ano_publicacion = models.CharField(max_length=100)
    numero_paginas = models.IntegerField()
    descripcion = models.CharField(max_length=100)
    intercambio = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=15, decimal_places=2)
    precio_renta = models.DecimalField(max_digits=15, decimal_places=2)
    email = models.ForeignKey(
        Usuario, models.DO_NOTHING, db_column='email')
    ruta_imagen = models.TextField()

    class Meta:
        managed = False
        db_table = "libro"


class IntercambiosAvisos(models.Model):
    id_aviso = models.AutoField(primary_key=True)
    id_libro_vendedor = models.ForeignKey(
        Libro, models.DO_NOTHING, db_column='id_libro_vendedor', related_name="intercambios_avisos_vendedor"
    )
    id_libro_cliente = models.ForeignKey(
        Libro, models.DO_NOTHING, db_column='id_libro_cliente', related_name="intercambios_avisos_cliente"
    )
    fecha = models.DateField()
    estado = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "intercambiosavisos"


class Transaccion(models.Model):
    id_transaccion = models.AutoField(primary_key=True)
    id_comprador = models.ForeignKey(
        Usuario, models.DO_NOTHING, db_column='id_comprador')
    id_libro = models.ForeignKey(
        Libro, models.DO_NOTHING, db_column='id_libro')
    tipo_transaccion = models.CharField(max_length=100)
    fecha = models.DateField()
    id_aviso = models.ForeignKey(
        IntercambiosAvisos, models.DO_NOTHING, db_column="id_aviso")
    calificacion = models.DecimalField(max_digits=1, decimal_places=1)

    class Meta:
        managed = False
        db_table = "transaccion"
