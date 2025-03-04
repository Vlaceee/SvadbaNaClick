/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// engleski PREVEDENO
function LogReg({ naslov, tekst, linkTo }) {
  const { t } = useTranslation();
  return (
    <div className="mx-4 my-3 flex w-full min-w-32 flex-grow flex-col flex-wrap items-center justify-between rounded-lg bg-snclbrown  p-5 shadow-lg sm:w-96">
      <p className="mb-5 text-center font-bold">
        {naslov}
      </p>
      <p className=" text-center ">
        {tekst}
      </p>
      <Link className="mt-5 rounded-lg bg-snclgray p-2 text-white shadow-lg hover:bg-snclblue" to={linkTo}>
        {t('register')}
      </Link>
    </div>
  );
}

export default LogReg;
