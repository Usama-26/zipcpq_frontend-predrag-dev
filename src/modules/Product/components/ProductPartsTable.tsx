import {type TOrderProduct} from '_types/types';
import {Button} from '@/components/Button';
import Image from 'next/image';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addProduct} from '@/store/cart-slice';
import ToolTip from '@/components/ToolTip';
import {Dialog, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import ThreeDViewSmall from '@/modules/3d-views/ThreeDViewSmall';
const products: TOrderProduct[] = [
  {
    id: 1,
    quantity: 2,
    cmiPartNumber: '10-351-0-00-00',
    description: 'Griper Bar Complete',
    oemPartNumber: 'BSA04120000FM',
  },
  {
    id: 2,
    quantity: 1,
    cmiPartNumber: '10-351-0-01-01',
    description: 'Shell (Assembly)',
    oemPartNumber: 'BSA04120000FM',
  },
  {
    id: 3,
    quantity: 1,
    cmiPartNumber: '10-351-0-01-01',
    description: 'Shell (Assembly)',
    oemPartNumber: 'BSA04120000FM',
  },
  {
    id: 4,
    quantity: 1,
    cmiPartNumber: '10-351-0-01-01',
    description: 'Shell (Assembly)',
    oemPartNumber: 'BSA04120000FM',
  },
  {
    id: 5,
    quantity: 1,
    cmiPartNumber: '10-351-0-01-01',
    description: 'Shell (Assembly)',
    oemPartNumber: 'BSA04120000FM',
  },
  {
    id: 6,
    quantity: 1,
    cmiPartNumber: '10-351-0-01-01',
    description: 'Shell (Assembly)',
    oemPartNumber: 'BSA04120000FM',
  },
];

const ProductPartsTable = () => {
  const dispatch = useDispatch();
  let [isOpen, setIsOpen]: any = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <div className="my-8 ">
      <div className="overflow-x-auto w-[350px] md:w-full mx-auto">
        <table className="table text-sm table-auto ">
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
                <td className="p-0 md:p-2">
                  <div>
                    <button onClick={openModal}>
                      <ToolTip text="View Item">
                        <Image
                          src="/icons/eye-outlined.svg"
                          width={512}
                          height={512}
                          alt="eye icon"
                          className="w-6 h-6"
                        />
                      </ToolTip>
                    </button>

                    <button onClick={() => dispatch(addProduct(item))}>
                      <Image
                        src="/icons/cart.svg"
                        width={512}
                        height={512}
                        alt="cart icon"
                        className="w-6 h-6 ml-2"
                      />
                    </button>
                  </div>
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
        className="rounded-md gap-2 hover:!bg-yellow-700 hover:!text-black hover:!border-l-black border-l border-transparent float-right uppercase mt-4 h-8 !py-1 !text-sm !bg-[#5B5B5B] disabled:bg-[#bdbdbd] md:mr-24"
      >
        <span>Learn more</span>
      </Button>

      {/* Modal */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-sm bg-white p-0 text-left align-middle shadow-xl transition-all">
                  <div>
                    <div className="flex flex-row bg-[#FFCB06] justify-between items-center p-4">
                      <h1 className="text-black font-poppins text-[25px] font-semibold">
                        Conway End Fitting O.S.
                      </h1>
                      <div onClick={closeModal}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-x"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-12 gap-2 p-3">
                      <div className="col-span-7 ">
                        <div className="border border-gray-200 p-1">
                          <h1 className="text-black text-[14px] font-poppins font-medium">
                            CMI # 10-318-0-02-00
                          </h1>
                          <div className="flex justify-center items-center">
                            <ThreeDViewSmall />
                          </div>
                        </div>
                        <div className="overflow-x-auto md:w-full mx-auto mt-5">
                          <table className="table text-sm table-auto w-full ">
                            {/* head */}
                            <thead>
                              <tr>
                                <th className="p-2 bg-[#FFCB06] text-black font-poppins text-[14px] font-semibold">
                                  CMI PART NO.
                                </th>
                                <th className="p-2 bg-[#FFCB06] text-black font-poppins text-[14px] font-semibold">
                                  OEM PART NO.
                                </th>
                                <th className="p-2 bg-[#FFCB06] text-black font-poppins text-[14px] font-semibold">
                                  DESCRIPTION
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="text-black font-poppins text-[14px] font-semibold">
                                <td className="p-2">10-318-0-15-00</td>
                                <td className="p-2">BSA0387016200</td>
                                <td className="p-2">Conway End Fitting O.S.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-span-5 px-4 text-left">
                        <div>
                          <h1 className="text-black text-[18px] font-poppins font-medium">
                            Conway End Fitting Operator Side that goes into the
                            gripper bars for Bobst die cutters SP 900 E and SP
                            900 ER; SP 1080 E and SP 1080 EEG; SPO 1080 E and
                            SPO 1080 EEG. Contact us for a quote.
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end px-5">
                      <div className="flex justify-center items-center gap-1">
                        <Image
                          src={'/images/exclamation.png'}
                          width={15}
                          height={15}
                          alt=""
                        />
                        <h1 className="text-[12.5px] font-poppins text-black font-semibold">
                          Default QTY = number of items used for this assembly
                        </h1>
                      </div>
                    </div>
                    <div className="flex justify-end px-5 mt-4 mb-5">
                      <div className="flex justify-center items-center gap-3">
                        <div></div>
                        <div>
                          <button className="bg-[#5B5B5B] rounded-lg px-4 py-2 text-white font-poppins font-bold text-[20px]">
                            LEARN MORE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductPartsTable;
