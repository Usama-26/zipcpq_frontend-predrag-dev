import {Button} from '@/components/Button';
import Header from '@/layouts/components/Header';
import Image from 'next/image';

import {useSelector, useDispatch} from 'react-redux';
import {
  decrementProduct,
  incrementProduct,
  removeProduct,
} from '@/store/cart-slice';
import {RootState} from '../store';

const ProductPartsTable = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cart.products);

  return (
    <>
      <Header />
      <div className="mx-16 my-8">
        <div className="overflow-x-auto w-full">
          <table className="table w-full text-sm">
            {/* head */}
            <thead>
              <tr className="uppercase">
                <th className="p-2"></th>
                <th className="p-2">Item No.</th>
                <th className="p-2">QTY</th>
                <th className="p-2">CMI Part No.</th>
                <th className="p-2">Description</th>
                <th className="p-2">OEM Part No.</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => (
                <tr key={item.id}>
                  <td className="p-2 text-center">
                    <input type="checkbox" className="checkbox" />
                  </td>
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.cmiPartNumber}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.oemPartNumber}</td>
                  <td className="p-2">
                    <span>
                      <button>
                        <Image
                          src="/icons/eye-outlined.svg"
                          width={512}
                          height={512}
                          alt="eye icon"
                          className="w-6 h-6 mr-2"
                        />
                      </button>
                      <button onClick={() => dispatch(removeProduct(item.id))}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => dispatch(incrementProduct(item.id))}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => dispatch(decrementProduct(item.id))}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12h-15"
                          />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot className="rounded-none">
              <tr>
                <th className="p-2 text-center">
                  <input type="checkbox" className="checkbox" />
                </th>
                <th className="p-2">Select all items</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
                <th className="p-2"></th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <Button
          disabled
          className="rounded-md gap-2 hover:!bg-yellow-700 hover:!text-black hover:!border-l-black border-l border-transparent float-right uppercase mt-4 h-8 !py-1 !text-sm !bg-[#5B5B5B] disabled:bg-[#bdbdbd]"
        >
          <span>Continue</span>
        </Button>
      </div>
    </>
  );
};

export default ProductPartsTable;
