import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  // OR using local (public folder)
  // -------------------------------------------------------
   const logo = (
     <Box
       component="img"
       src="/static/logo3.png"
       sx={{ width: 170, height: 50, cursor: 'pointer', ...sx }}
     />
   );

  if (disabledLink) {
    return <>{logo}</>;
  } 

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
