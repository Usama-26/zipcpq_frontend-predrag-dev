import {FormProvider, RHFTextField} from '@/components/HookForm';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';
import * as Yup from 'yup';
import React, {Suspense, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {TCustomForm, TFormField, TView} from '_types/types';
import {FormInputGroup} from '@/components/Form';
import Box from '@/components/Box';
import Link from 'next/link';
import {Button} from '@/components/Button';
import {getFormFieldAndValidations} from 'utils/helper';
import {registerApi} from 'apis/auth';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import {requestErrorHandler} from 'utils/request-error-handler';
import Image from 'next/image';
import AuthPageLogo from '@/components/Logos/AuthPageLogo';

interface RegisterProps {
  view: TView;
  fields: TFormField[];
}
const Register = ({view, fields}: RegisterProps) => {
  const router = useRouter();
  const {formFields, validations} = getFormFieldAndValidations(fields);

  const defaultValues = formFields;
  const methods = useForm({
    resolver: yupResolver(validations),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    setError,
    formState: {isSubmitting, errors},
  } = methods;

  const onSubmit = async (values: any) => {
    try {
      const res = await registerApi(values);
      if (res) {
        toast.success(res.data.message);
        reset();
        router.push('/auth/login');
      }
    } catch (error) {
      const {errorMessages} = requestErrorHandler(error);
      errorMessages.forEach((err: any) =>
        setError(err.field, {type: 'custom', message: err.message})
      );
    }
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen md:bg-gray-100 bg-white">
      <Box>
        <div className="w-96 md:w-[600px]">
          <AuthPageLogo />
          <h1 className="text-[30px] font-bold text-zinc-900 text-center mb-7 font-pt-sans">
            Create a new account
          </h1>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <Suspense key={field.id}>
                  <div
                    className={
                      field.field.slug === 'email' ||
                      field.field.slug === 'company'
                        ? 'col-span-2'
                        : ''
                    }
                  >
                    <FormInputGroup>
                      <RHFTextField
                        name={field.field.slug}
                        placeholder={`${field.field.translation.description}*`}
                        className={'rounded-md'}
                        type={field.ft.input_type}
                        regForm={true}
                      />
                    </FormInputGroup>
                  </div>
                  {field.validation_rules?.map(
                    validation =>
                      validation.slug == 'confirmed' && (
                        <FormInputGroup>
                          <RHFTextField
                            name="password_confirmation"
                            placeholder="Password confirmation*"
                            className={'rounded-md'}
                            type={'password'}
                            regForm={true}
                          />
                        </FormInputGroup>
                      )
                  )}
                </Suspense>
              ))}
            </div>
            <div className="flex justify-center">
              <div>
                <Button
                  type="submit"
                  size="lg"
                  className="mt-3 w-full mx-auto bg-zinc-700 dark:hover:bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-900 mb-4"
                >
                  Register
                </Button>
                <p className="text-center text-gray-500">
                  Already have login and password{' '}
                  <Link href="/auth/login" className="text-blue-700">
                    Login now
                  </Link>
                </p>
              </div>
            </div>
          </FormProvider>
        </div>
      </Box>
    </div>
  );
};

export default Register;
