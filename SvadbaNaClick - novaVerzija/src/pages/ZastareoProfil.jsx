/* eslint-disable import/no-named-as-default */
import { signOut } from 'firebase/auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import auth from '../firebase';

// engleski PREVEDENO
function ZastareoProfil() {
  const { t } = useTranslation();
  const handleSignOut = async () => {
    signOut(auth);
    window.location.reload();
  };
  return (
    <div className="flex size-full flex-col items-center justify-center gap-20 text-3xl">
      {t('zastareoProfil')}
      <button type="button" className="rounded-lg bg-snclbrown p-2 shadow-lg hover:bg-sncdbrown" onClick={handleSignOut}>{t('logout')}</button>
    </div>
  );
}

export default ZastareoProfil;
