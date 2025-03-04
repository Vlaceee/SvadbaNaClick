import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/base';
import { skodSchema } from '../schemas/schema';

// engleski PREVEDENO
function SecurityCodePage() {
  const { t } = useTranslation();
  const inputDugmeKlasa = 'h-7 w-64 rounded-md px-2 shadow-md ring-snc-dblue ring-1 outline-none';
  const inputDugmeKlasaLosa = ' ring-red ring-1 outline-none h-7 w-64 rounded-md px-2 shadow-md';
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await fetch('http://localhost:8080/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: values.email,
        }),
      });
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Error posting data:', err);
      console.log('Greska u registrovanju');
    }
  };

  const {
    values, handleBlur, handleChange, errors, touched, dirty, isValid,
  } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: skodSchema,
    onSubmit: () => {
      handleSubmit(values);
    },
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-around p-2">
      <div>
        <div className=" flex  w-full  flex-row flex-wrap">
          <div className="m-2 flex h-60 w-1/2 flex-grow flex-col  justify-evenly rounded-lg bg-snclblue p-3  text-white shadow-lg md:w-1/3">
            <p className=" text-2xl font-semibold">
              {t('whatIsCode')}
            </p>
            <div className="text-left ">
              <p>
                {t('security1')}
                <span className="font-extrabold">{t('security2')}</span>
                {t('security3')}
                <span className="font-extrabold">
                  {t('security4')}
                </span>
                {t('security5')}
              </p>
            </div>
          </div>
          <div className="m-2 flex h-60 w-1/2 flex-grow flex-col justify-evenly rounded-lg bg-snclblue p-3 text-white shadow-lg md:w-1/3">
            <p className="my-2 text-2xl font-semibold">
              {t('howToGetCodeQ')}
            </p>
            <div className="text-left ">
              <p>
                {t('howToGetCodeA')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={formSubmitHandler} className="  flex  items-center  p-3">
        <input
          className={errors.email && touched.email ? inputDugmeKlasaLosa : inputDugmeKlasa}
          onChange={handleChange}
          value={values.email}
          onBlur={handleBlur}
          placeholder={t('emailExample')}
          name="email"
        />
        <Button disabled={!(dirty && isValid)} type="submit" value="Posalji" className={!(dirty && isValid) ? 'mx-3 my-20 h-10 w-1/3 rounded-lg  bg-snclgray text-white shadow-lg' : 'mx-3 my-20 h-10 w-1/3 rounded-lg  bg-sncpink text-white shadow-lg hover:bg-snclpink'}>
          {' '}
          {t('send')}
        </Button>
      </form>
    </div>
  );
  
}

export default SecurityCodePage;
