interface InterfaceWithSignatures {

    /**
     * Call signature
     * @param a Some string
     * @someAnnotation
     */
    (a: string): number;

    /**
     * Construct signature
     * @param a Some string
     * @param b Some number
     * @someOtherAnnotation 123
     */
    new (a: string, b: number): Date;
}