import axiosInstance from 'utils/axios';

export async function registerApi(values: any) {
  return axiosInstance.post('customers/register', values);
}

export async function forgotPasswordApi(values: any) {
  return axiosInstance.post('customers/forgot_password', values);
}

export async function resetPasswordApi(values: any) {
  return axiosInstance.post('customers/reset_password', values);
}
