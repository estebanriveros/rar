from django.urls import path
from .views import RegistrarLibroView, CatalogoLibrosView, ComprarLibroView, RentarLibroView, IntercambiarLibroView, PerfilVendedorView, AceptarIntercambioView, DenegarIntercambioView, AvisosIntercambiosView, GetUserView, CalificacionTransaccionView, HistorialCompras, LibrosParaTransacciones, MisLibrosVendidos

urlpatterns = [
    path("registrarLibro", RegistrarLibroView.as_view()),
    path('catalogolibros', CatalogoLibrosView.as_view()),
    path('comprarlibro', ComprarLibroView.as_view()),
    path('rentarlibro', RentarLibroView.as_view()),
    path('intercambiarlibro', IntercambiarLibroView.as_view()),
    path('aceptarintercambio', AceptarIntercambioView.as_view()),
    path('denegarintercambio', DenegarIntercambioView.as_view()),
    path('avisosintercambios', AvisosIntercambiosView.as_view()),
    path('perfilvendedor', PerfilVendedorView.as_view()),
    path('calificaciontransaccion', CalificacionTransaccionView.as_view()),
    path('getuser', GetUserView.as_view()),
    path('historialcompras', HistorialCompras.as_view()),
    path('librosdisponibles', LibrosParaTransacciones.as_view()),
    path('librosvendidos', MisLibrosVendidos.as_view())
]
