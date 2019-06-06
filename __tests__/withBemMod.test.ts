import { cn, compose, withBemMod } from '@/index.ts';
import { mount } from '@vue/test-utils';
import Vue, { CreateElement } from 'vue';

describe('withBemMod', () => {
  const cnPresenter = cn('Presenter');

  const Presenter = Vue.extend({
    name: 'Presenter',
    render(h: CreateElement) {
      return h('div', { class: cnPresenter() }, this.$slots.default);
    },
  });

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

  it('should not add boolean modifier class', () => {
    const Enhanced1 = withBemMod(cnPresenter(), { big: true });

    const ResultComponent = compose(Enhanced1)(Presenter);

    const componentWrapper = mount(ResultComponent, {
      propsData: {
        big: true,
      },
    });

    expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_big']);
  });

  it('should add modifier enhancer', () => {
    const Enhanced1 = withBemMod(cnPresenter(), { enhanced: true }, Component => {
      return {
        functional: true,
        render(h: CreateElement, context) {
          return h(Component, context.data, ['Enhanced text']);
        },
      };
    });

    const ResultComponent = compose(Enhanced1)(Presenter);

    const componentWrapper = mount(ResultComponent, {
      propsData: {
        enhanced: true,
      },
    });

    expect(componentWrapper.text()).toEqual('Enhanced text');
    expect(componentWrapper.classes()).toEqual(['Presenter', 'Presenter_enhanced']);
  });
});
