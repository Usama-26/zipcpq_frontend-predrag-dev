import {type} from 'os';

export type TFormField = {
  id: number;
  field_id: number;
  custom_form_id: number;
  visible: string;
  field_word_id: string;
  table_word_id: string;
  referenced_to: string;
  order: number;
  table_type_id: string;
  ft: any;
  created_at: string;
  updated_at: string;
  field: TField;
  validation_rules?: TValidationRule[];
};

export type TField = {
  id: number;
  slug: string;
  table_model: string;
  word_id: string;
  referenced_to: string;
  field_type_id: string;
  table_type_id: string;
  created_at: string;
  updated_at: string;
  translation: TTranslation;
};

export type TTranslation = {
  id: number;
  description: string;
  word_id: string;
  language_id: string;
  created_at: string;
  updated_at: string;
};

export type TCustomForm = {
  id: number;
  name: string;
  is_active: string;
  created_at: string;
  updated_at: string;
};

export type TView = {
  id: number;
  description: string;
  route: string;
  custom_form_id: number;
  created_at: string;
  updated_at: string;
};

export type TValidationRule = {
  id: number;
  description: string;
  slug: string;
  input: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export type TCustomer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  password: string;
  company_id: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  status: string;
  locked: string;
};

export type TToken = {
  email: string;
  token: string;
  created_at: string;
};

export type TCategory = {
  id: number;
  parent_id: string;
  lft: string;
  rgt: string;
  depth: string;
  name: string;
  description: string;
  image: string;
  long_description: string;
  active: string;
  locked: string;
  created_at: string;
  updated_at: string;
};

export type TProduct = {
  id: string;
  title: string;
  category_id: string;
  short_description: string;
  description: string;
  status_id: string;
  created_by: string;
  modified_by: string;
  slug: string;
  availability: string;
  purchasability: string;
  product_brand_id: string;
  product_model_id: string;
  type_id: string;
  product_type_id: string;
  created_at: string;
  updated_at: string;
};
