interface InterfaceWithSignatures {

    /**
     * Call signature
     * @param a Some string
     * @annotation someAnnotation
     */
    (a: string): number;

    /**
     * Construct signature
     * @param a Some string
     * @param b Some number
     * @annotation someOtherAnnotation 123
     */
    new (a: string, b: number): Date;
}