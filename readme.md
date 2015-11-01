# jazzdot

Converts html-templates made with gulp-jazzdot to html-elements.

## How to use it
Write your template in HTML and save it with the extension `.tpl.html`.
Add the attribute `data-id` if you want make an element reachable from your code.
```html
<div>
    <button data-id="button">This button is exposed</button>
    <button>This button is not exposed</button>
</div>
```

## API
Assuming we saved the previous template under `frontPage/frontView.tpl.html`.
```js
var view = require('jazzdot')('frontPage/frontView');   //fetch the view
```

### .activate(HTMLElement)
This appends the template html to a HTML element.

### .populate(object)
This function accepts an object with `{key: value}` and `{key: [value1, value2, ...]}`.
Value can be of type HTML-element or text.

### .deactivate()
This removes the template html from the HTML element.

### .yourprop
All the elements exposed with `data-id=` are directly available on the view as HTML elements.