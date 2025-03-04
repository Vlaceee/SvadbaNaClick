import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <div className=" mt-2 flex w-full flex-col flex-wrap items-center justify-center  gap-3 bg-sncpink  p-6 text-center text-white sm:flex-row sm:justify-around">
      <Link to="/" className="flex flex-col hover:text-snclbrown">
        <p className="text-2xl font-bold ">Svadba Na Click</p>
        <p className="font-thin">{t('yourDreamWedding')}</p>
      </Link>
      <div>
        <Link to="/skod" className="font-thin hover:text-snclbrown">{t('safetyCode')}</Link>
      </div>
      <div className="flex flex-col gap-3">
        <Link to="/about" className="font-thin hover:text-snclbrown">{t('about')}</Link>
        <Link to="/contact" className="font-thin hover:text-snclbrown">{t('contact')}</Link>
      </div>
    </div>
  );
}

export default Footer;

