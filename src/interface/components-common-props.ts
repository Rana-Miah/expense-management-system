import { ReactNode } from "react";

export type WithSearchParams = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
export type WithChildren = {
  children: ReactNode
}

export type WithParams<T> = {
  params: Promise<T>
}