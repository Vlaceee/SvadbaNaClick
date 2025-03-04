import React from 'react';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useTranslation } from 'react-i18next';

// prevedeno na eng
function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="flex h-1/2 w-full flex-col items-center justify-center bg-snclbrown">
        <p className="text-3xl font-bold text-white">
          {t('contact')}
        </p>
        <AlternateEmailIcon className="m-3 text-white" fontSize="large" />
        <p className="text-xl text-white">
          info@snc.com
        </p>
      </div>
      <div className="flex h-1/2 w-2/3 items-center justify-center font-bold text-sncdblue">
        {t('contactUsText')}
      </div>
    </div>
  );
}

export default ContactPage;
