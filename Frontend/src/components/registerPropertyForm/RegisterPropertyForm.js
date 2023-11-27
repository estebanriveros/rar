import { Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { Children, useState } from "react";
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import CSRFToken from '../csrftoken';


export default function RegisterPropertyForm(){

    const confirmacion = () => {
        swal({
          text: 'Se ha registrado el inmueble exitosamente',
          icon: 'success',
          button: 'Aceptar',
        });
      };

    const [inmueble, setInmueble  ] = useState({
        tipo_inmueble : '',
        estrato : '',
        cedula : '',
        barrio : '',
        ciudad : '',
        direccion : '',
        complemento : '',


    });

    const estratos = [ 
      {value:"1", label:"1" },
      {value:"2", label:"2"},
      {value:"3", label:"3"},
      {value:"4", label:"4"},
      {value:"5", label:"5"},
      {value:"6", label:"6"},
    ]
    const inmuebleTipos =[
      {value:"residencial",label:"Residencial"},
      {value:"comercial",label:"Comercial"},
      {value:"industrial",label:"Industrial"}
    ]
    
    
    function handle(e,select=0){
      const newdata = { ...inmueble};
      if(select===1){
        newdata.tipo_inmueble=e.target.value
      }else if(select === 2){
        newdata.estrato=e.target.value;
      }else{
        newdata[e.target.id]=e.target.value;
      }
        
        
        setInmueble(newdata);
        console.log(newdata);
    }

    const url = 'http://127.0.0.1:8000/api/nuevoInmueble';
    function submit(e){
        e.preventDefault();
        fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(inmueble),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            return data;
          })
          .then((data) => {
            if (String(data.success) === 'Inmueble creado') {
              confirmacion();
            }
          })
          .catch((error) => console.warn(error));
      }
    

    return (

        <>
        <Stack spacing={2} sx={{
        '& .MuiTextField-root': { m: 1, width: '37ch' },
        }}>
          <Grid container columns={4} spacing={2} sx={{
        '& .MuiTextField-root': { m: 1, width: '16ch' },
        }} > 
            <CSRFToken />
            <Grid item lg={2}xs={2} md={2} > 
            
            <TextField
              id="tipo_inmueble"
              select
              label="Tipo de Inmueble"
              size='medium'
              onChange={(e)=>handle(e,1)}
              value={inmueble.tipo_inmueble}
              >
              {inmuebleTipos.map((optione) => (
              <MenuItem key={optione.value} value={optione.value}>
              {optione.label}
              </MenuItem>
              ))}

            </TextField>
            </Grid>



            <Grid item xs={2} md={2} > 
            <TextField
              id="estrato"
              select
              defaultValue= "1"
              helperText="Ingresa un estrato"
              size='medium'
              onChange={(e)=>handle(e,2)}
              value={inmueble.estrato}
              >
              {estratos.map((option) => (
              <MenuItem key={option.value} value={option.value}>
              {option.label}
              </MenuItem>
              ))}
              
              </TextField>
            </Grid>
            
            <Grid item xs={2} md={2} >
              <TextField
              onChange={(e)=>handle(e)}
                value={inmueble.cedula}
                size="medium"
                label="Cedula"
                id="cedula"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={2} sm={2} >
            
                <TextField
                onChange={(e)=>handle(e)}
                value={inmueble.barrio}
                size="medium"
                label="Barrio"
                id="barrio"
                variant="outlined"
                />
            </Grid>

            <Grid item xs={2} sm={2} >
                <TextField
                onChange={(e)=>handle(e)}
                value={inmueble.ciudad}
                size="medium"
                label="Ciudad"
                id="ciudad"
                variant="outlined"
                />
            </Grid>

            <Grid item xs={2} sm={2} >
                <TextField
                onChange={(e)=>handle(e)}
                value={inmueble.direccion}
                size="medium"
                label="Direccion"
                id="direccion"
                variant="outlined"
                />
            </Grid>

            <Grid item xs={2} sm={2} >
                <TextField
                onChange={(e)=>handle(e)}
                value={inmueble.complemento}
                size="medium"
                label="Complemento"
                id="complemento"
                variant="outlined"
                />
            </Grid>
            
            </Grid>

            <Stack spacing={2}>
            <Button variant="contained" onClick={(e)=> submit(e)}>
                {' '}
                Registrar Inmueble{' '}
            </Button>

            </Stack>


        </Stack>
        
        </>



    );


}