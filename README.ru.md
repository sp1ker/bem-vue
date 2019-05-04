# bem-vue
Адаптированная версия пакета [@bem-react/core](https://github.com/bem/bem-react/) для работы с vuejs.
Помогает организовать и управлять компонентами с БЭМ модификаторами во Vue.js с помощью HOC.

## Состав пакета
- `cn` - проброс библиотеки [@bem-react/classname](https://github.com/bem/bem-react/tree/master/packages/classname). Доукументация там же.
- `withBemMod` - функция для создания компонентов-модификаторов.
- `compose` - функция для композиции компонентов.

## Установка
npm i bem-vue --save

## Пример использования

Допустим, начальная структура приложения будет такой:
```
App.vue
Components/
  Button/
    Button.vue
```

### Шаг 1
В `Components/Button/index.js` определим пространство `Button`:
```js
import { cn } from 'bem-vue';

export const cnButton = cn('Button');
```


### Шаг 2
Создадим базовый вариант `Button` без установленных от родителя модификаторов в файле `Components/Button.vue`

```vue
<template>
    <component :class="classes" :is="tag ? tag : 'button'">
        <slot/>
    </component>
</template>
<script>
  import { cnButton } from './index';

  export default {
    name: 'Button',
    props: {
      tag: ''
    },
    computed: {
      classes() {
        return cnButton({}, [this.$attrs.class]);
      },
    },
  };
</script>
```

### Шаг 3
Добавим опционально варианты `withButtonTypeLink` и/или `withButtonThemeAction`, которые будут отрисовываться, когда в родительском компоненте будут переданы свойства `{type: 'link'}` и/или `{theme: 'action'}` соответственно.
Внутри `Components/Button/` создадим папки `_type/` с файлом `Button_type_link.js` и `_theme/` с файлом `Button_theme_action.js`.
```
App.vue
Components/
  Button/
    Button.vue
    index.js
+   _type/
+     Button_type_link.js
+   _theme/
+     Button_theme_action.js
```
Создадим модификаторы:

1) В `Components/Button/_type/Button_type_link.js`
    ```js
    import { withBemMod } from 'bem-vue';
    import { cnButton } from '../index';
    
    export const withButtonTypeLink = withBemMod(
      cnButton(),
      {type: 'link'},
      (Button) => {
        return {
          functional: true,
          render(h, context) {
            return h(Button, {
              ...context.data,
            props: {...context.props, tag: 'a'},
            }, context.children);
          },
        };
      },
    );
    ```
2) В `Components/Button/_type/Button_theme_action.js`
    ```js
    import { withBemMod } from 'bem-vue';
    import { cnButton } from '../index';
    
    export const withButtonThemeAction = withBemMod(
      cnButton(),
      {theme: 'action'},
    );
    ```

### Шаг 4
Наконец, в `App.vue` мы можем добавить только необходимые модификаторы к нашей кнопке.\
Будьте осторожны с порядком импорта, он может влиять напрямую на правила CSS.
```vue
<template>
    <div>
        <Button>I'm basic</Button>
        <!-- Renders into HTML as: <div class="Button">I'm Basic</div> -->
    
        <Button type="link" href="#">I'm type link</Button>
        <!-- Renders into HTML as: <a class="Button Button_type_link" href="#">I'm type link</a> -->
    
        <Button theme="action">I'm theme action</Button>
        <!-- Renders into HTML as: <div class="Button Button_theme_action">I'm theme action</div> -->
    
        <Button theme="action" type="link" href="#">I'm all together</Button>
        <!-- Renders into HTML as: <a class="Button Button_theme_action Button_type_link" href="#">I'm all together</a> -->
    </div>
</template>
<script>
  import { Button as ButtonPresenter } from './Components/Button/Button.vue';
  import { withButtonTypeLink } from './Components/Button/_type/Button_type_link';
  import { withButtonThemeAction } from './Components/Button/_theme/Button_theme_action';

  const Button = compose(
    withButtonThemeAction,
    withButtonTypeLink,
  )(ButtonPresenter);

  export default {
    name: 'App',
    components: {
      Button
    },
  };
</script>
```
