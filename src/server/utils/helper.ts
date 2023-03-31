import {ClassValue, clsx} from 'clsx';
import {TJoin} from 'server/models/types';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Make an object serializable to JSON.
//
// Useful to convert an object which may contain non-serializeable data such as
// Dates to an object that doesn't
export function makeSerializable<T extends any>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}
