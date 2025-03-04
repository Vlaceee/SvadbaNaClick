import React from 'react';
import { useTranslation } from 'react-i18next';

// prevedeno na eng
function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="m-3 flex flex-col justify-around gap-10 text-justify ">
      <div className="rounded-lg bg-snclbrown p-10 text-snclgray shadow-lg">
        <p className="text-2xl font-extrabold">
          {t('about')}
          ...
        </p>
        <p>
          {t('aboutText')}
        </p>
      </div>
      <div className="rounded-lg bg-snclbrown p-10 text-snclgray shadow-lg">
        <p className="text-2xl font-extrabold">
          {t('ourVision')}
          :
        </p>
        <p>
          {t('ourVisionText')}
        </p>
      </div>
      <div className="rounded-lg bg-snclbrown  p-10 text-snclgray shadow-lg">
        <p className="text-2xl font-extrabold">{t('whatMakesUsDifferent')}</p>
        <p>
          <span className="font-bold">{t('wideRange')}</span>
          {' '}
          {t('whatMakesUsDifferentText1')}
        </p>
        <p>
          <span className="font-bold">{t('simpleAndEfficient')}</span>
          {' '}
          {t('whatMakesUsDifferentText2')}
        </p>
        <p>
          <span className="font-bold">{t('personalizedOptions')}</span>
          {' '}
          {t('whatMakesUsDifferentText3')}
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
