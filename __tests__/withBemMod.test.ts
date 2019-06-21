import { cn, compose, withBemMod } from '@/index.ts';
import { ClassNameFormatter } from '@bem-react/classname';
import { mount } from '@vue/test-utils';
import Vue, { CreateElement } from 'vue';

describe('withBemMod', () => {
  const getPresenter = (cnPresenter: ClassNameFormatter) => {
    return Vue.extend({
      name: 'Presenter',
      render(h: CreateElement) {
        return h('div', { class: cnPresenter() }, this.$slots.default);
      },
    });
  };

  describe('has classes', () => {
    const cnPresenter = cn('Presenter');

    const Presenter = getPresenter(cnPresenter);

    it('should has only Block class', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { theme: 'normal' });
      const ResultComponent = compose(Enhanced1)(Presenter);
      const componentWrapper = mount(ResultComponent);

      expect(componentWrapper.classes()).toEqual(['Presenter']);
    });

    it('should add modifier class for theme prop with single modifier', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { theme: 'normal' });

      const ResultComponent = compose(Enhanced1)(Presenter);
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          theme: 'normal',
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_theme_normal']);
    });

    it('should add modifier class for theme prop with multiple modifiers', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { theme: 'normal' });
      const Enhanced2 = withBemMod(cnPresenter(), { view: 'default' });

      const ResultComponent = compose(
        Enhanced1,
        Enhanced2,
      )(Presenter);
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          theme: 'normal',
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_theme_normal']);
    });

    it('should add modifier class for view prop', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { theme: 'normal' });
      const Enhanced2 = withBemMod(cnPresenter(), { view: 'default' });

      const ResultComponent = compose(
        Enhanced1,
        Enhanced2,
      )(Presenter);

      const componentWrapper = mount(ResultComponent, {
        propsData: {
          view: 'default',
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_view_default']);
    });

    it('should add modifier class for view and theme props', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { theme: 'normal' });
      const Enhanced2 = withBemMod(cnPresenter(), { view: 'default' });

      const ResultComponent = compose(
        Enhanced1,
        Enhanced2,
      )(Presenter);

      const componentWrapper = mount(ResultComponent, {
        propsData: {
          theme: 'normal',
          view: 'default',
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_theme_normal', 'Presenter_view_default']);
    });

    it('should not add modifier class for star matched prop', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { star: '*' });

      const ResultComponent = compose(Enhanced1)(Presenter);

      const componentWrapper = mount(ResultComponent, {
        propsData: {
          star: 'star value',
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter']);
    });

    it('should add boolean modifier class', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { big: true });

      const ResultComponent = compose(Enhanced1)(Presenter);

      const componentWrapper = mount(ResultComponent, {
        propsData: {
          big: true,
        },
      });

      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_big']);
    });

    it('should mix classes', () => {
      const Enhanced1 = withBemMod(cnPresenter(), { modifier: true });

      const ResultComponent = compose(Enhanced1)(Presenter);

      const PresenterWrapper = Vue.extend({
        name: 'PresenterWrapper',
        render(h: CreateElement) {
          return h(ResultComponent, {
            class: { 'mix-class': true },
            props: {
              modifier: true,
            },
          });
        },
      });

      const componentWrapper = mount(PresenterWrapper);

      expect(componentWrapper.classes()).toEqual(['Presenter', 'mix-class', 'Presenter_modifier']);
    });
  });

  describe('with enhancer', () => {
    const cnPresenter = cn('Presenter');
    const Presenter = getPresenter(cnPresenter);

    const resultComponentFactory = () => {
      const Enhanced1 = withBemMod(cnPresenter(), { enhanced: true }, Component => {
        return {
          functional: true,
          render(h: CreateElement, context) {
            return h(Component, context.data, ['Enhanced text']);
          },
        };
      });

      return compose(Enhanced1)(Presenter);
    };

    it('should add enhancer', () => {
      const ResultComponent = resultComponentFactory();
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          enhanced: true,
        },
      });

      expect(componentWrapper.text()).toEqual('Enhanced text');
      expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_enhanced']);
    });

    it('should not add enhancer', () => {
      const ResultComponent = resultComponentFactory();
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          enhanced: false,
        },
      });

      expect(componentWrapper.text()).toEqual('');
      expect(componentWrapper.classes()).toEqual(['Presenter']);
    });
  });

  describe('with listener', () => {
    const cnPresenter = cn('Presenter');
    const Presenter = getPresenter(cnPresenter);

    const resultComponentFactory = (state: any) => {
      const Enhanced1 = withBemMod(cnPresenter(), { enhanced: true }, Component => {
        return {
          functional: true,
          render(h: CreateElement, context) {
            return h(
              Component,
              {
                ...context.data,
                nativeOn: {
                  click() {
                    state.counter++;
                  },
                },
              },
              ['Enhanced text'],
            );
          },
        };
      });

      return compose(Enhanced1)(Presenter);
    };

    it('should emit modifier native listener if turned on', () => {
      const state = Vue.observable({
        counter: 0,
      });

      const ResultComponent = resultComponentFactory(state);
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          enhanced: true,
        },
      });

      componentWrapper.trigger('click');

      expect(state.counter).toEqual(1);
    });

    it('should emit modifier native listener if it turned off', () => {
      const state = Vue.observable({
        counter: 0,
      });

      const ResultComponent = resultComponentFactory(state);
      const componentWrapper = mount(ResultComponent, {
        propsData: {
          enhanced: false,
        },
      });

      componentWrapper.trigger('click');

      expect(state.counter).toEqual(0);
    });
  });
});
