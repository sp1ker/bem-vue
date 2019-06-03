import {mount} from '@vue/test-utils';
import {cn, compose, withBemMod} from '../src';
import {CreateElement} from "vue";

describe('withBemMod', () => {
    const cnPresenter = cn('Presenter');

    const Presenter = {
        name: 'Presenter',
        props: {},
        render(h: CreateElement) {
            return h('div', {class: cnPresenter()});
        }
    };

    it('should has only Block class', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {theme: 'normal'});
        const ResultComponent = compose(Enhanced1)(Presenter);
        const componentWrapper = mount(ResultComponent);

        expect(componentWrapper.classes()).toEqual(["Presenter"]);
    });

    it('should add modifier class for theme prop with single modifier', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {theme: 'normal'});

        const ResultComponent = compose(Enhanced1)(Presenter);
        const componentWrapper = mount(ResultComponent, {
            propsData: {
                theme: 'normal'
            }
        });

        expect(componentWrapper.classes()).toEqual(["Presenter", "Presenter_theme_normal"]);
    });

    it('should add modifier class for theme prop with multiple modifiers', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {theme: 'normal'});
        const Enhanced2 = withBemMod(cnPresenter(), {view: 'default'});

        const ResultComponent = compose(Enhanced1, Enhanced2)(Presenter);
        const componentWrapper = mount(ResultComponent, {
            propsData: {
                theme: 'normal'
            }
        });

        expect(componentWrapper.classes()).toEqual(["Presenter", "Presenter_theme_normal"]);
    });

    it('should add modifier class for view prop', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {theme: 'normal'});
        const Enhanced2 = withBemMod(cnPresenter(), {view: 'default'});

        const ResultComponent = compose(Enhanced1, Enhanced2)(Presenter);

        const componentWrapper = mount(ResultComponent, {
            propsData: {
                view: 'default'
            }
        });

        expect(componentWrapper.classes()).toEqual(["Presenter", "Presenter_view_default"]);
    });

    it('should add modifier class for view and theme props', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {theme: 'normal'});
        const Enhanced2 = withBemMod(cnPresenter(), {view: 'default'});

        const ResultComponent = compose(Enhanced1, Enhanced2)(Presenter);

        const componentWrapper = mount(ResultComponent, {
            propsData: {
                theme: 'normal',
                view: 'default'
            }
        });

        expect(componentWrapper.classes()).toEqual(["Presenter", "Presenter_theme_normal", "Presenter_view_default"]);
    });

    it('should not add modifier class for star matched prop', () => {
        const Enhanced1 = withBemMod(cnPresenter(), {star: '*'});

        const ResultComponent = compose(Enhanced1)(Presenter);

        const componentWrapper = mount(ResultComponent, {
            propsData: {
                star: '1'
            }
        });

        expect(componentWrapper.classes()).toEqual(["Presenter"]);
    });
});
