import {ClassNameFormatter, cn} from '@bem-react/classname';
import {CreateElement} from "vue";

//TODO: set types

function composeMods(
    h: CreateElement,
    mod: any,
    entity: ClassNameFormatter,
    context: any,
    enhance: any,
    ModifiedComponent: any,
    WrappedComponent: any,
    props: any) {
    let mods = Object.keys(mod).reduce((acc: any, key: string) => {
        if (mod[key] !== '*') acc[key] = mod[key];

        return acc;
    }, {});

    const modifierClassName = entity(mods).replace(`${entity()} `, '');

    context.data.class = {
        ...context.data.class,
        [modifierClassName]: true,
    };

    if (enhance !== undefined) {
        if (ModifiedComponent === undefined) {
            ModifiedComponent = enhance(WrappedComponent);
        }
    } else {
        ModifiedComponent = WrappedComponent;
    }

    return h(ModifiedComponent, {
        props: props,
        ...context.data,
    }, context.children);
}

export function withBemMod(blockName: string, mod: any, enhance?: any) {
    return function WithBemMod(WrappedComponent: any) {
        let ModifiedComponent: any;

        return {
            functional: true,
            props: Object.keys(mod).reduce((mods: { [key: string]: {} }, modName: string) => {
                mods[modName] = {};
                return mods;
            }, {}),
            render(h: CreateElement, context: any) {
                const entity: ClassNameFormatter = cn(blockName);
                const props = context.props;
                const isMatched = (key: string) => (props)[key] === mod[key];
                const isStarMatched = (key: string) => mod[key] === '*' &&
                    Boolean((props)[key]);

                if (Object.keys(mod).every(key => isMatched(key) || isStarMatched(key))) {
                    return composeMods(h, mod, entity, context, enhance, ModifiedComponent, WrappedComponent, props);
                }

                return h(WrappedComponent, context.data, context.children);
            },
        };
    };
}

export function compose(...funcs: any[]) {
    return funcs.reduce(
        (a, b) => {
            return (...args: any[]) => {
                return a(b(...args));
            }
        },
        (arg: any) => {
            console.log('last-function', arg);
            return arg
        }
    );
}
