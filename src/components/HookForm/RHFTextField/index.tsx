import React from 'react';
import {TextInput} from '../../Form';
import {useFormContext, Controller} from 'react-hook-form';
interface IRHFTextField extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  regForm: boolean;
}
export default function RHFTextField({
  className,
  name,
  regForm,
  ...other
}: IRHFTextField) {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <TextInput
          error={error}
          helperText={error?.message}
          className={[
            'w-full rounded-2xl py-3 px-10 bg-gray-100 focus:bg-white focus:outline-none border border-transparent focus:border-gray-300 mb-4',
            className,
            regForm && 'px-4',
          ].join(' ')}
          {...field}
          {...other}
        />
      )}
    />
  );
}
