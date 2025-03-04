import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegCard from '../components/RegCard';

function ChooseRegisterPage() {
  const { t } = useTranslation();
  return (
    <div className="relative flex w-full flex-col items-center justify-center bg-gray-100 py-10">
      <h1 className="mb-8 text-3xl font-bold text-snclbrown">{t('Choose your role')}</h1>

      <div className="mb-8 flex flex-wrap justify-center">
        <Link
          to="/register/client"
          className="m-3 h-12 w-40 rounded-md bg-snclbrown p-2 text-center font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-sncdbrown"
        >
          {t('newlywed')}
        </Link>
      </div>

      <div className="flex flex-wrap justify-center">
        <RegCard naziv={t('restaurant')} linkTo="/register/restoran" />
        <RegCard naziv={t('decorater')} linkTo="/register/dekorater" />
        <RegCard naziv={t('photographer')} linkTo="/register/fotograf" />
        <RegCard naziv={t('baker')} linkTo="/register/poslasticar" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 flex h-full w-20 flex-col items-center justify-center bg-transparent">
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-20 flex-col items-center justify-center bg-transparent">
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
        <svg className="mb-4 h-8 w-8 text-snclbrown" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0zM12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2s9.8 4.4 9.8 9.8S17.4 21.8 12 21.8z" />
        </svg>
      </div>
    </div>
  );
}

export default ChooseRegisterPage;
