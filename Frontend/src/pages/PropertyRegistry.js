import { Box, Container } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { styled } from '@mui/material/styles';
import RegisterPropertyForm from "../components/registerPropertyForm/RegisterPropertyForm";
import useResponsive from "../hooks/useResponsive";
import Logo from "../components/logo";


const StyledRoot2 = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
    },
  }));



  export default function(){
    const mdUp = useResponsive('up', 'md');
    return(
    <>
    
    <Helmet>
        <title> Registrar | RentARead </title>
    </Helmet>

    <Container maxWidth='sm' class="container-sm">
        <StyledRoot2>
        {mdUp && (<Logo style={{position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'}}/>)}

        <Box style = {{position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)' }}>

        <h1>Registrar un inmueble</h1>
        <RegisterPropertyForm/>


        </Box>

        </StyledRoot2>
    </Container>
    
    </>
    )

  }