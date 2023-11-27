import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import swal from 'sweetalert';
import account from '../_mock/account';

export default function MapView() {
  const [listalibros, setListalibros] = useState([]);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goToHome, setGoToHome] = useState(false);

  const url = 'http://127.0.0.1:8000/api/catalogolibros';

  useEffect(() => {
    if (Cookies.get('nombre')) {
      // La cookie existe
      console.log('La cookie existe');
    } else {
      // La cookie no existe
      setGoToHome(true);
      console.log('La cookie no existe');
    }

    const obtenerCoordenadas = () => {
      const latitud = Cookies.get('latitud');
      const longitud = Cookies.get('longitud');
      // Agrega más llamadas a Cookies.get() para obtener otros datos de las cookies

      return {
        latitud,
        longitud,
      };
    };

    setUserData(obtenerCoordenadas());

    function fetchCatalogo() {
      setIsLoading(true);
      setError(null);

      swal({
        title: 'Cargando',
        text: 'Un momento...',
        icon: 'info',
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      });

      fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if ('success' in data) {
            Cookies.set('listalibros', data.success); // Guardar los datos en la cookie listalibros
            console.log('LISTALIBROS', data.success);
            setListalibros(data.success);
          } else if ('error' in data) {
            setError(data.error);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
          swal.close();
        });
    }

    fetchCatalogo();
  }, []);

  if (isLoading) {
    return <p>Cargando mapa...</p>;
  }

  if (error) {
    return <p>Error al cargar el mapa: {error}</p>;
  }

  if (goToHome) {
    return <Navigate to="/home" />;
  }

  const markers = listalibros.map((place, index) => (
    <Marker
      key={place.id}
      position={[parseFloat(place.lat) + index * 0.001, parseFloat(place.lng) + index * 0.001]}
      icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
    >
      <Popup>
        <div>
          <Link to="/dashboard/book">
            <h3>{place.titulo}</h3>
          </Link>
          <p>{place.uso}</p>
        </div>
      </Popup>
    </Marker>
  ));

  return (
    <MapContainer
      style={{ height: '70vh', width: '72vw' }}
      center={[userData.latitud, userData.longitud]}
      zoom={13}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
}
