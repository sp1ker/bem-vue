import { cn } from '@bem-react/classname';

//TODO: set types

function withBemMod(blockName: string, mod: any, modProps: any, enhance: any) {
    return function WithBemMod(WrappedComponent: any) {
        let ModifiedComponent: any;

        return {
            functional: true,
            render(h: any, context: any) {
                const entity = cn(blockName);
                const props = context.props;
                const isMatched = (key: string) => (props)[key] === mod[key];
                const isStarMatched = (key: string) => mod[key] === '*' &&
                  Boolean((props)[key]);

                if (Object.keys(mod).every(key => isMatched(key) || isStarMatched(key))) {
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

                return h(WrappedComponent, context.data, context.children);
            },
        };
    };
}

function compose(...funcs: any[]) {
    return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg);
}

export {
    withBemMod,
    compose,
};
