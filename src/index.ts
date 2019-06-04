import { ClassNameFormatter, cn, NoStrictEntityMods } from '@bem-react/classname';
import vue, { ComponentOptions, CreateElement, FunctionalComponentOptions, RenderContext } from 'vue';

export * from '@bem-react/classname';
export type Enhance<V extends vue> = (
  WrappedComponent: ComponentOptions<V> | FunctionalComponentOptions,
) => FunctionalComponentOptions;

export function withBemMod<V extends vue>(blockName: string, mod: NoStrictEntityMods, enhance?: Enhance<V>) {
  return function WithBemMod(WrappedComponent: ComponentOptions<V> | FunctionalComponentOptions) {
    let ModifiedComponent: ComponentOptions<V> | FunctionalComponentOptions;

    return {
      functional: true,
      name: WrappedComponent.name,
      props: Object.keys(mod).reduce((mods: { [key: string]: {} }, modName: string) => {
        mods[modName] = {};
        return mods;
      }, {}),
      render(h: CreateElement, context: RenderContext) {
        const entity: ClassNameFormatter = cn(blockName);
        const props = context.props;
        const isMatched = (key: string) => props[key] === mod[key];
        const isStarMatched = (key: string) => mod[key] === '*' && Boolean(props[key]);

        if (Object.keys(mod).every(key => isMatched(key) || isStarMatched(key))) {
          const mods = Object.keys(mod).reduce((acc: any, key: string) => {
            if (mod[key] !== '*') {
              acc[key] = mod[key];
            }

            return acc;
          }, {});

          const modifierClassName = (entity(mods) + ' ').replace(`${entity()} `, '').trim();

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

          return h(
            ModifiedComponent,
            {
              ...context.data,
              props,
            },
            context.children,
          );
        }

        return h(
          WrappedComponent,
          {
            ...context.data,
            props,
          },
          context.children,
        );
      },
    };
  };
}

export function compose(...funcs: any[]) {
  let mods = {};

  return funcs.reduce(
    (a, b) => {
      return (component: any) => {
        mods = Object.assign({}, mods, component.hasOwnProperty('props') ? component.props : {});
        component.props = mods;

        return a(b(component));
      };
    },
    (arg: any) => {
      arg.props = Object.assign({}, arg.props ? arg.props : {}, mods);
      return arg;
    },
  );
}
