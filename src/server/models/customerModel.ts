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
    query: `select * from ${tableName} where email=?`,
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
    try {
      const info = await sendMail({
        to: createdData!.email, // list of receivers
        subject: 'Conway machine Registration!', // Subject line
        text: '', // plain text body
        html: `Hello!
          You're successfully registered with Conways machine.
          Click <a href="${process.env.APP_URL}/auth/login"><button>here</button></a> for login
        Regards,
        zipCPQ eCommerce`, // html body
      });
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log(error);
    }

    return true;
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
    if (token) {
      const info = await sendMail({
        to: email, // list of receivers
        subject: 'Reset Password Notification', // Subject line
        text: '', // plain text body
        html: `Hello!
        You are receiving this email because we received a password reset request for your account.
        
        <a href="${process.env.APP_URL}/auth/reset-password?token=${token.token}&email=${token.email}"><button>Reset Password</button></a>
        This password reset link will expire in 60 minutes.
        
        If you did not request a password reset, no further action is required.
        
        Regards,
        zipCPQ eCommerce`, // html body
      });
      console.log('Message sent: %s', info.messageId);
      return true;
    }
    return false;
  }
  return false;
};

const resetPassword = async (data: {
  [key: string]: any;
}): Promise<boolean | string> => {
  const token = await customerPasswordResetModel.findFirst(
    `email='${data.email}' and token='${data.token}'`
  );
  const diff = moment().diff(moment(token.created_at), 'minutes'); // 1
  if (diff > (process.env.RESET_PW_EXPIRATION || 5)) {
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
} = {
  tableName,
  columns,
  create,
  findFirst,
  forgotPassword,
  isMailExist,
  resetPassword,
  findByCredentials,
};

export default customerModel;
