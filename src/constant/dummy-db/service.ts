
export const findBy = <T extends Record<string,unknown>,>(arr:T[],property:T)=>{
    return arr.find(item=>{
        const keys = Object.keys(property)
        for (const key of keys) {
            if(item[key]===property[key]){
                return item
            }            
        }
    })
}