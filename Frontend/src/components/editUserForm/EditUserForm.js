import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import Cookies from "js-cookie";
import { useState } from "react";
import CSRFToken from "../csrftoken";

export default function EditUserForm(){
    const [editData,setEditData]= useState({
        correo_electronico:'',
        nombre:'',
        telefono:'',
        tipo_documento:''
    })
    
    const docType=[
        {value:"cc", label:"C.C"},
        {value:"nit",label:"N.I.T."}

    ]
    const handle=(e,select=0)=>{
        const newEdit={ ...editData};
        if(select===1){
            newEdit.tipo_documento=e.target.value
        }else{
            newEdit[e.target.id]= e.target.value
        }
        setEditData(newEdit)
        console.log(newEdit);

    }

    const confirmacion=()=>{}

    const url = 'http://127.0.0.1:8000/api/editar_usuario';
    function submit(e){
        e.preventDefault();
        fetch(url, {
          method: 'PUT',
          credentials: 'same-origin',
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(editData),
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

    return(

        <>
        
        <Stack sx={{
        '& .MuiTextField-root': { m: 1, width: '37ch' },
        }}>
        <Grid container columns={2} spacing={2} sx={{
        '& .MuiTextField-root': { m: 1, width: '37ch' },
        }}>
            <CSRFToken />
            
            <Grid item lg={1}xs={1} md={1}>
                <TextField 
                id='correo_electronico'
                label='Correo Electronico'
                onChange={(e)=>handle(e)}
                value={editData.correo_electronico}
                size='medium'
                variant='outlined'/>
            </Grid>

            <Grid item lg={1}xs={1} md={1}>
                <TextField 
                id='nombre'
                label='Nombre Completo'
                onChange={(e)=>handle(e)}
                value={editData.nombre}
                size='medium'
                variant='outlined'/>
            </Grid>

            <Grid item lg={1}xs={1} md={1}>
                <TextField 
                id='telefono'
                label='Telefono'
                onChange={(e)=>handle(e)}
                value={editData.telefono}
                size='medium'
                variant='outlined'/>
            </Grid>

            <Grid item lg={1}xs={1} md={1}>
                <TextField 
                id='tipo_documento'
                select
                label='Tipo De Documento'
                onChange={(e)=>handle(e,1)}
                value={editData.tipo_documento}
                size='medium'
                variant='outlined'>
                    { docType.map((optione) => (
                        <MenuItem key={optione.value} value={optione.value}>
                        {optione.label}
                        </MenuItem>
                    ))}

                </TextField>

            </Grid>

            

        </Grid>

        <div>
        <Button onClick={(e) => submit(e)} variant='contained'> Guardar Cambios </Button>
        
        </div>
        </Stack>
        </>




    );
    



}