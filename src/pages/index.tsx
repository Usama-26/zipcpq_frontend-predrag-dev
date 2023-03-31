import {GetServerSideProps, InferGetServerSidePropsType} from 'next';

import {setLicenseDB} from '../server/db';
import productModel from 'server/models/productModel';
import categoryModel from 'server/models/categoryModel';
import dynamic from 'next/dynamic';
import EmptyLayout from '@/layouts/EmptyLayout';
const Catalog = dynamic(() => import('@/modules/catalog'), {});

// export default function Home({ styleUrl, fields }: { styleUrl: string, fields: any }) {
export default function Home() {
  //   {
  //   products,
  //   categories,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //   console.log(products, categories);
  return (
    <EmptyLayout>
      <Catalog />
    </EmptyLayout>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
//   if (!(await setLicenseDB(req.headers.host))) {
//     return {
//       notFound: true,
//     };
//   }
//   const categories = await categoryModel.find({});
//   // const products = await productModel.findBySlug('sdfsdfsdf');
//   const products = await productModel.find({
//     withJoins: ['users', 'product_types'],
//   });
//   // console.log(products);
//   return {
//     props: {products, categories},
//   };
// };
