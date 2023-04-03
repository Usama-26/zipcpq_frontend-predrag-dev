import {TCustomer} from '_types/types';
import {
  baseFindFirst,
  baseFind,
  baseCreateRecord,
  baseUpdateRecord,
  baseDeleteRecord,
} from '../db';
import {TModel} from './types';
import bcrypt from 'bcrypt';
import {BCRYPT_SALT_ROUND} from 'server/constant';
import {sendMail} from 'server/mail';
import customerPasswordResetModel from './customerPasswordResetModel';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import {render} from '@react-email/render';
import VerificationEmail from 'server/templates/email/verification-email';
import ResetPasswordEmail from 'server/templates/email/reset-password-email';
import WelcomeEmail from 'server/templates/email/welcome-email';

const tableName = 'customers';
const columns = [
  'id',
  'first_name',
  'last_name',
  'email',
  'email_verified_at',
  'password',
  'company_id',
  'remember_token',
  'created_at',
  'updated_at',
  'status',
  'locked',
];
const joins: any[] = [];

const findFirst = async (where: string): Promise<TCustomer | null> => {
  return await baseFindFirst({
    licenseDb: true,
    query: `select * from ${tableName} where ${where}`,
    values: [],
  });
};

const findByCredentials = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<TCustomer | null> => {
  const user = await baseFindFirst({
    licenseDb: true,
    query: `select * from ${tableName} where email=? AND email_verified_at IS NOT NULL`,
    values: [username],
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    console.log('match', match);
    if (match) return user;
    return null;
  }
  return null;
};

const create = async ({data}: {data: {[key: string]: any}}) => {
  if (await isMailExist(data.email)) return true;
  data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUND);
  const result = await baseCreateRecord({
    licenseDb: true,
    table: tableName,
    data,
  });
  let createdData = null;
  if (result) {
    createdData = await findFirst(`id=${result.insertId}`);
    console.log(createdData);

    const token = jwt.sign(
      {id: result.insertedId},
      process.env.NEXTAUTH_SECRET + result.email,
      {
        expiresIn: '1d',
      }
    );
    const validationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}&email=${data.email}`;
    const html = render(VerificationEmail({validationLink}));
    const info = await sendMail({
      to: data.email,
      subject: 'Verify your registration for Conway Machine!',
      text: '',
      html,
    });
    console.log('Message sent: %s', info.messageId);
  }
  console.log('createdData', createdData);
  return true;
};

const forgotPassword = async (email: string): Promise<boolean> => {
  const user = await baseFindFirst({
    licenseDb: true,
    query: `select * from ${tableName} where email=?`,
    values: [email],
  });
  if (user) {
    // Hash an empty string with the salt to generate a random string
    const token = await customerPasswordResetModel.create(email);
    const html = render(
      ResetPasswordEmail({
        resetPasswordLink: `${process.env.APP_URL}/reset-password?token=${token}`,
      })
    );
    if (token) {
      const info = await sendMail({
        to: email, // list of receivers
        subject: 'Reset Password Notification', // Subject line
        text: '', // plain text body
        html,
      });
      console.log('Message sent: %s', info.messageId);
      return true;
    }
    return false;
  }
  return false;
};

const verifyEmail = async (token: string, email: string): Promise<boolean> => {
  const user = await customerModel.findFirst(`email='${email}'`);
  console.log('userhhhh', user);
  if (user.email_verified_at) {
    return true;
  }
  console.log('userffff', user);
  console.log('token', token);
  if (!token) {
    return false;
  }

  const isValid = await new Promise(resolve => {
    jwt.verify(token as string, process.env.NEXTAUTH_SECRET! + email, err => {
      if (err) resolve(false);
      if (!err) resolve(true);
    });
  });
  console.log('isValid', isValid);
  if (!isValid) {
    return false;
  }

  const result = await baseUpdateRecord({
    licenseDb: true,
    table: 'customers',
    data: {email_verified_at: new Date().toISOString()},
    where: `email='${email}'`,
  });
  console.log('verify updated', result);

  const html = render(WelcomeEmail());
  await sendMail({
    to: email as string,
    subject: 'Welcome to Conway Machine!',
    html,
    text: '',
  });

  return true;
};

const resetPassword = async (data: {
  [key: string]: any;
}): Promise<boolean | string> => {
  const token = await customerPasswordResetModel.findFirst(
    `email='${data.email}' and token='${data.token}'`
  );
  const diff: number = moment().diff(moment(token.created_at), 'minutes'); // 1
  if (diff > (Number(process.env.RESET_PW_EXPIRATION) || 5)) {
    return 'TOKEN_EXPIRED';
  }

  const newHash = await bcrypt.hash(data.password, BCRYPT_SALT_ROUND);
  if (token) {
    const result = await baseUpdateRecord({
      licenseDb: true,
      table: tableName,
      data: {password: newHash},
      where: `email='${data.email}'`,
    });
    if (result)
      await customerPasswordResetModel.deleteRecord(
        `email='${data.email}' and token='${data.token}'`
      );
    return true;
  }
  return false;
};

const isMailExist = async (email: string) => {
  return await baseFindFirst({
    licenseDb: true,
    query: `select * from ${tableName} where email=?`,
    values: [email],
  });
};

const customerModel: TModel & {
  create: ({}: any) => Promise<any>;
  findFirst: ({}: any) => Promise<any>;
  forgotPassword: (email: string) => Promise<boolean>;
  isMailExist: (email: string) => Promise<boolean>;
  resetPassword: (data: any) => Promise<boolean | string>;
  findByCredentials: ({}: any) => Promise<TCustomer | null>;
  verifyEmail: (token: string, email: string) => Promise<boolean>;
} = {
  tableName,
  columns,
  create,
  findFirst,
  forgotPassword,
  isMailExist,
  resetPassword,
  findByCredentials,
  verifyEmail,
};

export default customerModel;
