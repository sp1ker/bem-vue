import { ClassNameFormatter, cn, NoStrictEntityMods } from '@bem-react/classname';
import { ComponentOptions, CreateElement, FunctionalComponentOptions, RenderContext } from 'vue';
import { Vue } from 'vue/types/vue';

export type Enhance<V extends Vue> = (WrappedComponent: ComponentOptions<V> | FunctionalComponentOptions) => FunctionalComponentOptions;

export function withBemMod<V extends Vue>(blockName: string, mod: NoStrictEntityMods, enhance?: Enhance<V>) {
  return function WithBemMod(WrappedComponent: ComponentOptions<V> | FunctionalComponentOptions) {
    let ModifiedComponent: ComponentOptions<V> | FunctionalComponentOptions;

    return {
      functional: true,
      props: Object.keys(mod).reduce((mods: { [key: string]: {} }, modName: string) => {
        mods[modName] = {};
        return mods;
      }, {}),
      render(h: CreateElement, context: RenderContext) {
        const entity: ClassNameFormatter = cn(blockName);
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

export function compose(...funcs: any[]) {
  return funcs.reduce(
    (a, b) => {
      return (...args: any[]) => {
        return a(b(...args));
      };
    },
    (arg: any) => {
      console.log('last-function', arg);
      return arg;
    },
  );
}
