import React from 'react';
import { Button } from '@mui/base';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogReg from '../components/LogReg';

// Engleski PREVEDENO
function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-20 mt-8 flex flex-col items-center ">
        <h1 className="my-8 text-center text-7xl font-bold">Svadba Na Click</h1>

        <p className="text-xl font-thin">
          {' '}
          {t('organizeWedding')}
        </p>
      </div>
      <div className="mb-8 flex flex-row flex-wrap" id="registerSection">
        <LogReg naslov={t('areYouClient')} tekst={t('areYouClientText')} linkTo="/register/client" />
        <LogReg naslov={t('areYouOrganizer')} tekst={t('areYouOrganizerText')} linkTo="/register" />
      </div>
      <div className="mb-2 flex flex-row items-center">
        <p className="mx-1">{t('alreadyHave')}</p>
        <Button className=" mx-1 rounded-lg bg-snclblue p-2 text-white shadow-lg hover:bg-sncdblue">
          <Link to="/login">
            {t('login')}
          </Link>
        </Button>
      </div>
      <div className="mt-6 flex h-96 w-full flex-row items-center justify-evenly bg-snclbrown text-snclgray">
        <div className="divide-y divide-sncdbrown">
          <p className="text-3xl font-bold">
            {t('about')}
            ...
          </p>

          <div>
            <p className="my-5 text-xl font-thin">{t('projectDoneBy')}</p>
            <p className="font-thin">Andrija </p>
            <p className="font-thin">Vlastimir </p>
            <p className="font-thin">Ilija </p>
          </div>
        </div>

      </div>
      <div className=" flex h-96 w-full flex-col  items-center justify-center  bg-white px-20  text-center text-snclgray">
        <span className="my-8 text-xl font-bold">Svadba Na Click</span>
        {t('landingAbout')}
      </div>
    </div>
  );
}

export default LandingPage;
