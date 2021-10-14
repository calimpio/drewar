export namespace Types {
    export namespace Specificator {
        /**
         * String have to be encoded before will use.
         *   
         * `Comparators: Specificator.ComparatorEnum`
         * 
         * `Operators: Specificator.BoolOperatorEnum`
         * 
         * @example "field1=vale|field>=2"
         */
        export type SpecEncodedURIComponentString = string;


        /**
         * String have to be decoded before will use.
         *   
         * `Comparators: Specificator.ComparatorEnum`
         * 
         * `Operators: Specificator.BoolOperatorEnum`
         * 
         * @example "field1=vale|field>=2"
         */
        export type SpecDecodedURIComponentString = string;
    }
}

