# Markdown Renderer and Cheat Sheet

The wiki uses a powerful markdown renderer that supports GitHub Flavored Markdown (GFM) along with several enhanced features.

## Basic Markdown Syntax

### Headers

Markdown:

```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

Renders as:

# H1 Header

## H2 Header

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

### Text Formatting

Markdown:

```markdown
**Bold text**
*Italic text*
~~Strikethrough text~~
```

Renders as:

**Bold text**
*Italic text*
~~Strikethrough text~~

### Lists

Markdown:

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
   1. Nested item
```

Renders as:

* Unordered list item
* Another item
  * Nested item

1. Ordered list item
2. Another item
   1. Nested item

### Links and Images

Markdown:

```markdown
[Link text](https://example.com)
![Wiki Logo](/static/images/android-chrome-192x192.png)
```

Renders as:

[Link text](https://example.com)
![Wiki Logo](/static/images/android-chrome-192x192.png)

### Blockquotes

Markdown:

```markdown
> This is a blockquote
> Multiple lines
>> Nested blockquotes
```

Renders as:

> This is a blockquote
> Multiple lines> Nested blockquotes

## Enhanced Features

### Tables

Markdown:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

Renders as:

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Code Blocks

Markdown:

````markdown
```javascript
const hello = "world";
console.log(hello);
```
````

Renders as:

```javascript
const hello = "world";
console.log(hello);
```

### Admonitions

Markdown:

```markdown
:::note
This is a note admonition
:::

:::tip
This is a tip admonition
:::

:::info
This is an info admonition
:::

:::caution
This is a caution admonition
:::

:::danger
This is a danger admonition
:::
```

Renders as:

:::note
This is a note admonition
:::

:::tip
This is a tip admonition
:::

:::info
This is an info admonition
:::

:::caution
This is a caution admonition
:::

:::danger
This is a danger admonition
:::

### GitHub Flavored Markdown (GFM)

#### Task Lists

Markdown:

```markdown
- [x] Completed task
- [ ] Incomplete task
```

Renders as:

* [x] Completed task
* [ ] Incomplete task

#### Tables with Alignment

Markdown:

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
|Left  |Center  |Right  |
```

Renders as:

| Left | Center | Right |
| :--- | :----: | ----: |
| Left | Center | Right |

#### Footnotes

Markdown:

```markdown
Here's a sentence with a footnote[^1].

[^1]: This is the footnote.
```

Renders as:

Here's a sentence with a footnote\[^1].

\[^1]: This is the footnote.

#### Autolinked References

Markdown:

```markdown
https://example.com
#123
123abc
```

Renders as:

[https://example.com](https://example.com)
\#123
123abc

## Special Features

### Automatic Heading Links

All headers automatically get anchor links that appear on hover, allowing easy linking to specific sections. Try hovering over any heading in this document to see the link icon appear.

### Image Optimization

Images are automatically optimized using Next.js Image component, providing:

* Lazy loading
* Automatic sizing
* Priority loading for the first image
* WebP format conversion

Example image with optimization:

```markdown
![Optimized Image](path/to/image.jpg)
```

### Code Block Features

Code blocks include interactive features:

```python
def example_function():
    print("This code block has:")
    print("- A copy button (top right)")
    print("- A collapse/expand button")
    print("- Syntax highlighting")
    print("- Language indicator")
```

### Table Enhancements

Tables include responsive features:

| Feature       | Description                                 | Example                             |
| ------------- | ------------------------------------------- | ----------------------------------- |
| Responsive    | Tables scroll horizontally on small screens | This table demonstrates the feature |
| Hover Effects | Rows highlight on mouse hover               | Try hovering over these rows        |
| Styling       | Consistent borders and spacing              | Visible in this table               |

### Navigation

Each page includes an automatic navigation section at the bottom showing:

* Previous page link
* Next page link
* Page hierarchy

Try scrolling to the bottom of this page to see the navigation in action.