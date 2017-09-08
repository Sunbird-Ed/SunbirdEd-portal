# angular-pagedown

A pagedown editor for AngularJS. View this [Plunker](http://plnkr.co/edit/2LZiw454g77k6aE3HTyd) for demo.

## Instructions

1. `bower install angular-pagedown --save`
1. This will install also [pagedown](https://github.com/baminteractive/PageDown) dependencies.
1. Import these files in your HTML
  1. pagedown/Markdown.Converter.js
  1. pagedown/Markdown.Sanitizer.js
  1. pagedown/Markdown.Extra.js
  1. pagedown/Markdown.Editor.js
  1. angular-pagedown/angular-pagedown.js
  1. angular-pagedown/angular-pagedown.css
1. If you're using a build tool like [grunt/gulp's main-bower-files](https://github.com/ck86/main-bower-files), you **don't need to import the files manually**.
  1. But add this in your **bower.json**
  ```
  "overrides": {
    "pagedown": {
      "main": [
        "Markdown.Converter.js",
        "Markdown.Sanitizer.js",
        "Markdown.Extra.js",
        "Markdown.Editor.js",
        "wmd-buttons.png"
      ]
    }
  }
  ```
1. Include dependency in your app `angular.module("yourApp", ["ui.pagedown"]);`

This package comes with 2 directives:

## Editor

```html
<pagedown-editor content="data.content"></pagedown-editor>
```

Options:

#### content

1. An expression. 
1. *Expression*: Mandatory
1. Example: `<pagedown-editor content="data.content"></pagedown-editor>`
1. Example: `<pagedown-editor content="'**some** _markdown_ text'"></pagedown-editor>`

#### show-preview

1. Should a live preview be displayed. 
1. *Boolean*: Default to true

#### help

1. An expression to invoke upon clicking the help (?) button. 
1. *Expression*: Default to open http://daringfireball.net/projects/markdown/syntax in new window
1. Example: `<pagedown-editor content="data.content" help="showSomeHelp()"></pagedown-editor>`

#### insert-image

1. An expression to invoke upon clicking the "Insert Image" button. 
1. *Expression*: Default to `noop`
1. Example: `<pagedown-editor content="data.content" insert-image="promptImageUrl()"></pagedown-editor>`
  1. The parent scope function `promptImageUrl` must return either:
    - A string of image URL.
    - A promise resolved with a string of image URL.

#### placeholder

1. An expression.
1. *Expression*: Default to empty string
1. Example: `<pagedown-editor content="data.content" placeholder="{{data.placeholder}} or anything"></pagedown-editor>` 

#### editor-class

1. An expression to use as [ngClass](https://docs.angularjs.org/api/ng/directive/ngClass).
1. *Expression*: Default to `wmd-input`
1. Example: `<pagedown-editor content="data.content" editorClass="{'a-class': true}"></pagedown-editor>`
1. Example: `<pagedown-editor content="data.content" editorClass="'a-class another-class'"></pagedown-editor>`
1. Example: `<pagedown-editor content="data.content" editorClass="aScopeVariable"></pagedown-editor>`

#### editor-rows

1. Number of rows for the `<textarea>` element
1. *Number*: default to 10

#### preview-class

1. An expression to use as [ngClass](https://docs.angularjs.org/api/ng/directive/ngClass).
1. *Expression*: Default to `wmd-panel wmd-preview`
1. See `editor-class`

#### preview-content

1. An expression, will be updated with converted HTML when the editor content changes. Can be coupled with `show-preview="false"` and a custom previewer.
1. Optional

## Viewer

```html
<pagedown-viewer content="data.content"></pagedown-viewer>
```

## TODO
1. Grunt setup to minify files.
1. Extend PageDown editor to allow override of hyper link insertion.
