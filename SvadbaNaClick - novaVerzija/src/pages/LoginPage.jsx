/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFormik } from 'formik';
import { auth } from '../firebase';
import { loginSchema } from '../schemas/schema';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const inputDugmeKlasa = 'w-full  bg-white text-sncdblue outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue rounded-lg p-1 shadow-lg';
  const inputDugmeKlasaLosa = 'w-full  ring-red ring-1  bg-white text-sncdblue outline-none rounded-lg p-1 shadow-lg';

  const handleSubmit = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setError(false);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(true);
    }
  };

  const {
    values, handleBlur, handleChange, errors, touched,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: () => {
      handleSubmit(values);
    },
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };

  return (
    <div className="flex w-full flex-row flex-wrap-reverse items-center justify-center">
      <div className="m-6 mx-10 items-center self-center text-center">
        <Link to="/" className="hover:text-snclbrown">
          <p className="text-5xl font-extrabold">Svadba Na Click</p>
          <p className="my-3 text-center font-thin">{t('organizeWedding')}</p>
        </Link>
      </div>
      <form onSubmit={formSubmitHandler} className="m-6 mx-10 grid h-fit min-w-96 max-w-96 rounded-xl bg-snclbrown p-6 text-white shadow-lg">
        <p className="text-xl font-extrabold text-snclgray">{t('login')}</p>
        <div className="mt-5">
          <div className="mb-3">
            <p>E-mail</p>
            <input
              name="email"
              className={errors.email && touched.email ? inputDugmeKlasaLosa : inputDugmeKlasa}
              onChange={handleChange}
              value={values.email}
              placeholder={t('emailExample')}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && <p className="text-red">{errors.email}</p>}
          </div>
          <div className="">
            <p>{t('password')}</p>
            <input
              name="password"
              className={errors.password && touched.password ? inputDugmeKlasaLosa : inputDugmeKlasa}
              onChange={handleChange}
              value={values.password}
              placeholder={t('writeYourPassword')}
              type="password"
              onBlur={handleBlur}
            />
            {errors.password && touched.password && <p className="text-red">{errors.password}</p>}
            <p className="float-end mt-2 text-xs">
              {t('forgotPassword')}
              <Link to="/" className="mx-2 text-sncpink ">{t('changePassword')}</Link>
            </p>
          </div>
        </div>
        {error && <p className="text-red">{t('Greska u prijavljivanju!')}</p>}
        <div className="mt-20 flex justify-end">
          <button type="submit" className="my-6 h-10 w-1/3  rounded-lg bg-sncpink shadow-lg hover:bg-snclpink">
            {t('login')}
          </button>
        </div>
        <div className="flex flex-row">
          <p>{t('dontHaveAcc')}</p>
          <span><Link to="/register" className="mx-2 text-sncpink">{t('register')}</Link></span>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
