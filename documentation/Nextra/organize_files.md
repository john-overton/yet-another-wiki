# Organize Files

Nextra first collects all your Markdown files and configurations from the
`pages` directory, and then generates the “page map information” of your entire
site, to render things such as the _navigation bar_ and _sidebar_ below:

<br />

<figure>
  <>![Example of Nextra Theme Docs](/assets/routing@1x.png)</>
  <figcaption>
    Example: [Nextra Docs Theme](/docs/docs-theme) has sidebar and navbar
    generated automatically from Markdown files.
  </figcaption>
</figure>

## Default Behavior

By default, the page map contains all `.md` and `.mdx` filenames and the
directory structure, sorted alphabetically. Then, Nextra will use the
[title](https://github.com/vercel/title) package to get formatted page names
from filenames.

For example if you have the following structure:

<FileTree>
  <FileTree.Folder name="pages" defaultOpen>
    <FileTree.File name="contact.md" />
    <FileTree.File name="index.mdx" />
    <FileTree.Folder name="about" defaultOpen>
      <FileTree.File name="legal.md" />
      <FileTree.File name="index.mdx" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

The resolved page map will be (note that all names were sorted alphabetically):

```json
[
  {
    "name": "About",
    "children": [{ "name": "Index" }, { "name": "Legal" }]
  },
  { "name": "Contact" },
  { "name": "Index" }
]
```

And the global page map will be imported to each page by Nextra. Then,
configured theme will render the actual UI with that page map.

## `_meta.js`

It's very common to customize each page's title, rather than just relying on
filenames. Having a page titled "Index" lacks clarity. It is preferable to
assign a meaningful title that accurately represents the content, such as
"Home".

That’s where `_meta.js` files comes in. You can have an `_meta.js` file in each
directory, and it will be used to override the default configuration of each
page:

<FileTree>
  <FileTree.Folder name="pages" defaultOpen>
    <FileTree.File name="_meta.js" />
    <FileTree.File name="contact.md" />
    <FileTree.File name="index.mdx" />
    <FileTree.Folder name="about" defaultOpen>
      <FileTree.File name="_meta.js" />
      <FileTree.File name="legal.md" />
      <FileTree.File name="index.mdx" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

### Allowed Extensions

It's possible to use the `.jsx`, `.ts` and `.tsx` extensions for `_meta` files
as well (e.g. `_meta.ts`).

### Sorting Pages Alphabetically

You can use ESLint's built-in `sort-keys` rule, append
`/* eslint sort-keys: error */` comment at the top of your `_meta` file, and you
will receive ESLint's errors about incorrect order.

### Usage with `next-sitemap`

If you are using
[next-sitemap](https://github.com/iamvishnusankar/next-sitemap), you will
probably need to add `exclude: ['*/_meta']{:js}` to your
`next-sitemap.config.js` file, as it is
[tricky to exclude `_meta` files from the build](https://github.com/vercel/next.js/issues/8974#issuecomment-542525837).

### Allowed Keys Values

The type of your `_meta` keys should be always `string` and not `number` since
[numbers are always ordered first](https://dev.to/frehner/the-order-of-js-object-keys-458d)
for JavaScript objects.

Following:

```js filename="pages/_meta.js"
export default {
  foo: '',
  1992_10_21: '',
  1: ''
}
```

Will be converted to:

{/* prettier-ignore */}
```js filename="pages/_meta.js"
export default {
  '1': '',
  '19921021': '',
  foo: ''
}
```

## Example

Put this in your `pages/_meta.js` file:

```js filename="pages/_meta.js"
export default {
  index: 'My Homepage',
  contact: 'Contact Us',
  about: 'About Us'
}
```

It tells Nextra the order of each page, and the correct title.

Alternatively, you can do it with `title` property and have other configurations
in there as well:

```js filename="pages/_meta.js"
export default {
  index: 'My Homepage',
  contact: 'Contact Us',
  about: {
    title: 'About Us'
    // ... extra configurations
  }
}
```

The extra configurations are passed to the **theme** as additional information.
Check the corresponding pages for more information:

<Cards>
  <Cards.Card
    icon={<NewsletterIcon />}
    title="Docs Theme"
    href="/docs/docs-theme/page-configuration"
    arrow
  />
  <Cards.Card
    icon={<FileIcon />}
    title="Blog Theme"
    href="/docs/blog-theme/start"
    arrow
  />
  <Cards.Card title="Custom Theme" href="/docs/custom-theme" arrow />
</Cards>