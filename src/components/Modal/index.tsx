import React, {ReactNode, Fragment, useRef} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import OverlayLoader from '../OverlayLoader';

interface IModalProps {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  header?: string | ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export default function Modal({
  open,
  setOpen,
  header,
  footer,
  children,
  loading,
}: IModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <>
      {loading && open && <OverlayLoader />}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full  justify-center p-2 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className="relative w-96 transform overflow-hidden
                  rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 "
                >
                  <div className="overflow-auto">
                    {setOpen && (
                      <div className="absolute right-4 pt-4 flex flex-row-reverse">
                        <XMarkIcon
                          className="cursor-pointer w-5 h-5"
                          onClick={() => setOpen(false)}
                        />
                      </div>
                    )}
                    {!!header && (
                      <div className="bg-gray-50 p-4 border-b">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900 flex flex-shrink-0 items-center"
                        >
                          {header}
                        </Dialog.Title>
                      </div>
                    )}
                    <div className="bg-white p-4 mt-6">{children}</div>
                    {!!footer && (
                      <div className="bg-gray-50 p-4 sm:flex sm:flex-row-reverse border-t">
                        {footer}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
