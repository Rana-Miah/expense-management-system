
type Methods = 'get' | 'create'
// | 'create' | 'update' | 'delete'
// type GetFor = 'single' | 'multiple'
type Entities = 'bank' | 'trxName' | 'assignTrxName'

// Dynamic plural: add "s" (can enhance later for special cases)
type Plural<E extends string> =
    E extends `${infer Rest}y` ? `${Rest}ies` : `${E}s`;

//Singular vs plural capitalization
type CapitalizeEntity<E extends string, P extends boolean> = Capitalize<P extends true ? Plural<E> : E>;

// Value patterns per method

export type GetPattern<
    E extends string,
    P extends boolean = false
> = `${CapitalizeEntity<E, P>} retrieved!`;

export type CreatePattern<E extends string,
    P extends boolean = false> =
    E extends 'assignTrxName' ? `Transaction name assigned!` : `${CapitalizeEntity<E, P>} created!`;

export type UpdatePattern<E extends string,
    P extends boolean = false> = `${CapitalizeEntity<E, P>} updated!`;

export type DeletePattern<E extends string,
    P extends boolean = false> = `${CapitalizeEntity<E, P>} deleted!`;


// Value patterns for CRUD methods
// Generic mapping from method to pattern type
type ValuePattern<M extends Methods, E extends, P extends boolean = false> =
    M extends 'get' ? GetPattern<E, P> :
    M extends 'create' ? CreatePattern<E, P> :
    M extends 'update' ? UpdatePattern<E, P> :
    M extends 'delete' ? DeletePattern<E, P> :
    never;



// Special message patterns
type NotFoundMessage = `${string} does not exist!`;
type ExistMessage = `${string} already exist!`;
type AssignedMessage = `${string} already assigned with "${string}" ${string}`;
type NewAssignMessage = `Transaction name "${string}" assigned to "${string}" bank`;

// Message function type
type MessageFunction = <
    M extends Methods,
    IsPlural extends boolean
>(plural?: IsPlural) => ValuePattern<M, IsPlural>;

// Full MessageObj type
export type MessageObj = {
    [M in Methods]:
    M extends 'get'
    ? GetPattern<string, boolean>
    : M extends 'create'
    ? CreatePattern<string, boolean>
    : M extends 'update'
    ? UpdatePattern<string, boolean>
    : M extends 'delete'
    ? DeletePattern<string, boolean>
    : never
}
// & {
//     special: {
//         notFound: (value: string) => NotFoundMessage;
//         exist: (value: string) => ExistMessage;
//         assigned: (trxName: string, bankName: string) => AssignedMessage;
//         newAssign: (trxName: string, bankName: string) => NewAssignMessage;
//     };
// };

// Runtime helpers
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
export const pluralize = <T extends string, P extends boolean>(entity: T, isPlural?: P): P extends true ? Plural<T> : T => {

    const lastCharacter = entity[entity.length - 1];

    if (isPlural) {
        if (lastCharacter === 'y') {
            return (entity.slice(0, -1) + 'ies') as P extends true ? Plural<T> : T;
        }
        if (lastCharacter === 's') {
            return (entity + 'es') as P extends true ? Plural<T> : T;
        }
        return (entity + 's') as P extends true ? Plural<T> : T;
    }

    return entity as P extends true ? Plural<T> : T;
}




const obj = {
    get: (value: string, IsPlural: boolean) => `${capitalize(pluralize(value, IsPlural))} retrieved!`,
    create: (value: string) => `${capitalize(value)} created!`,
    update: (value: string, IsPlural: boolean) => `${capitalize(pluralize(value, IsPlural))} retrieved!`,
    delete: (value: string, IsPlural: boolean) => `${capitalize(pluralize(value, IsPlural))} retrieved!`,
}


// export const messageType = {
//     get: {
//         single: {
//             bank: 'Bank retrieved!',
//             trxName: 'Transaction names retrieved!',
//             assignTrxName: 'Assigned transaction name retrieved!',
//         },
//         multiple: {
//             banks: 'All banks retrieved!',
//             trxNames: 'All transaction names retrieved!',
//             assignTrxNames: 'All assigned transaction names retrieved!',
//         }
//     },
//     create: {
//         bank: 'Bank created!',
//         trxName: 'Transaction names created!',
//         assignTrxName: 'Assigned transaction name created!',
//     },
//     update: {
//         bank: 'bank updated!',
//         trxName: 'Transaction names updated!',
//         assignTrxName: 'Assigned transaction name updated!',
//     },
//     delete: {
//         bank: 'bank deleted!',
//         trxName: 'Transaction names deleted!',
//         assignTrxName: 'Assigned transaction name deleted!',
//     },
// }



// export const message = {}