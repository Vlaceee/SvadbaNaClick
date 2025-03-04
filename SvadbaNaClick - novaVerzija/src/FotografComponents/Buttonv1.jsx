import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

// engleski PREVEDENO
export default function Buttonv1() {
  const { t } = useTranslation();
  return (
    <Box sx={{ '& button': { m: 1 } }}>

      <div className="mr-16">

        <Button variant="contained" size="medium">
          {t('login')}
        </Button>

      </div>
    </Box>
  );
}
