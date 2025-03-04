import { t } from 'i18next';
import React from 'react';

function BadUrlPage() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <h1 className="text-3xl font-bold">{t('404 - Stranica ne postoji')}</h1>
    </div>
  );
}
export default BadUrlPage;
