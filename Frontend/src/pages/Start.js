import { Rating } from "@mui/material";

// Funcion que nos permitirá mostrar la calificación en forma de estrellas.
// recibe un numero entre del 0-5 y un envento del raton


export default function Start({ value }) {
  const maxStars = 5;

  return (
    <Rating
      name="star-rating"
      value={value}
      precision={0.5}
      readOnly
      max={maxStars}
      sx={{
        position: 'absolute',
          top : '32vh',
          left: '15vw',
      }}
    />
  );
}

