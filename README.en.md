# bem-vue
Vue.js version of package [@bem-react/core](https://github.com/bem/bem-react/).
helps organize and manage components with [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in Vue.js.

## Composition
- `cn` - proxy of [@bem-react/classname](https://github.com/bem/bem-react/tree/master/packages/classname) package.
- `withBemMod` - helping to create component variants.
- `compose` - compose variants in one component.

## Install
npm i bem-vue --save

## Usage

For example, you have an initial App file structure as follows:
```
App.vue
Components/
  Button/
    Button.vue
```

### Step 1
In `Components/Button/index.js` define the class space `Button`:
```js
import { cn } from 'bem-vue';

export const cnButton = cn('Button');
```


### Step 2
Create base variant of `Button` variant which will be rendered if no modifiers props are set in the parent component. Inside `Components/Button.vue`:
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

### Step 3
Set up the **optional** `withButtonTypeLink` and **optional** `withButtonThemeAction`, variants that will be rendered if `{type: 'link'}` and/or `{theme: 'action'}` modifiers are set in the parent component respectively.
Inside your `Components/Button/` add folders `_type/` with `Button_type_link.js` and `_theme/` with `Button_theme_action.js`.
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

Set up the variants:

1) In `Components/Button/_type/Button_type_link.js`
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
2) In `Components/Button/_type/Button_theme_action.js`
    ```js
    import { withBemMod } from 'bem-vue';
    import { cnButton } from '../index';
    
    export const withButtonThemeAction = withBemMod(
      cnButton(),
      {theme: 'action'},
    );
    ```

### Step 4
Finally, in `App.vue` you need compose only necessary the variants with the basic Button. Be careful with the import order - it directly affects your CSS rules.
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
