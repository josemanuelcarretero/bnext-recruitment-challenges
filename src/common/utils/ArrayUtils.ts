export class ArrayUtils {
    static matchElementsBetween<type>(
        listA: type[],
        listB: type[],
        getter?: (element: type) => any
    ): type[] {
        if (getter === null || getter === undefined) {
            getter = element => {
                return element;
            };
        }
        return listA.filter(a => listB.some(b => getter(a) === getter(b)));
    }
    static noMatchElementsIn<type>(
        listA: type[],
        listB: type[],
        getter?: (element: type) => any
    ): type[] {
        if (getter === null || getter === undefined) {
            getter = element => {
                return element;
            };
        }
        return listA.filter(a => !listB.some(b => getter(a) === getter(b)));
    }
}
