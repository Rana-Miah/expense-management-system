import { db } from "@/drizzle/db"
import { and, eq, not, or, SQLWrapper } from "drizzle-orm";
import { UpdateMessage } from "next/dist/build/swc/types";

export * from './response'


export type NotEmptyStr<T extends string> = T extends "" ? never : T

export type Replace<Str extends string, ReplaceWith extends string = "_"> =
  Str extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>} ${Replace<Capitalize<Tail>>}`
  : Str extends `${infer BU}_${infer AU}`
  ? `${BU} ${Replace<Capitalize<AU>>}`
  : Str extends `${infer Head} ${infer Tail}` ? `${Head}${ReplaceWith}${Tail}`
  : Str


export type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S;


export type RequiredOnly<T> = {
  [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K];
}

export type OptionalOnly<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K];
}

export type Pagination = {
  page: number
  limit: number;
  total: number;
}



export type FirstCharacter<Character extends string> = Character extends `${infer F}${string}` ? F : never


// --- Pluralization rules ---
type Pluralize<T extends string> =
  T extends `${infer Stem}y` ? `${Stem}ies` :
  T extends `${string}ies` ? T :
  T extends `${string}es` ? T :
  T extends `${string}s` ? T :
  `${T}s`;

export type NotFoundMessage<T extends string = string> = T extends `${Capitalize<string>} does not exist!` ? T : never
export type ExistMessage<T extends string = string> = T extends `${Capitalize<string>} already exist!` ? T : never
export type AssignedMessage<T extends string = string> =
  T extends `${Capitalize<string>} already assigned with "${Capitalize<string>}" bank` ? T : never
export type GetMessage<T extends string = string> = T extends `${T} created!` ? T : never
export type NewCreatedMessage<T extends string = string> = T extends `${Capitalize<string>} created!` ? T : never
export type UpdatedMessage<T extends string = string> = T extends `${Capitalize<string>} updated!` ? T : never
export type DeletedMessage<T extends string = string> = T extends `${Capitalize<string>} deleted!` ? T : never
export type NewAssignMessage<T extends string = string> = T extends `Transaction name "${string}" assigned to "${string}" bank` ? T : never


export type QueryKey = keyof typeof db.query
export type Query = typeof db.query

export type Find = keyof Query[QueryKey]

export type QueryOptions<
  T extends QueryKey,
  F extends Find
> = Parameters<Query[T][F]>[number]



