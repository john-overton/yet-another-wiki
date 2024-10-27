# Welcome to Yet Another Wiki!

\##Code Block

```plaintext
 POST /home 200 in 43ms
 GET /api/auth/session 200 in 14ms
Reading file from: C:\Projects\yet-another-wiki\app\docs\home.mdx
 GET /api/file-content?path=home.mdx 200 in 7ms
Starting MDX bundling...
MDX bundling successful
 POST /home 200 in 52ms
```

## Table

| stuff          | things     | other things            |
| -------------- | ---------- | ----------------------- |
| does this work | i think so | this needs to be edited |
| hmm            | its        | dark                    |

Hello and welcome to Yet Another Wiki! We're excited to have you here. This platform is designed to be your go-to place for creating, organizing, and sharing knowledge using the power of MDX (Markdown + JSX).

## What You Can Do with Yet Another Wiki

Here's a quick overview of what you can accomplish:

1. **Create Rich Content**: MDX allows you to combine the simplicity of Markdown with the power of JSX components.
2. **Organize Your Knowledge**: Easily create a hierarchical structure for your documentation.
3. **Collaborate**: Share your wiki with others and work together to build a knowledge base.
4. **Customize**: Tailor the appearance and functionality of your wiki pages.

## Working with MDX Files

MDX is a powerful format that extends Markdown with JSX capabilities. Here's what you need to know:

### Basic Markdown Syntax

You can use all the standard Markdown syntax:

* **Headers**: Use `#` for h1, `##` for h2, etc.
* **Lists**: Create bullet points with `-` or `*`, and numbered lists with `1.`, `2.`, etc.
* **Emphasis**: Use `*italic*` for *italic* and `**bold**` for **bold**.
* **Links**: Create links with `[text](url)`.

### JSX Components

You can also use custom React components directly in your MDX:

```jsx
<UserCard name="John Doe" role="Admin" />
```

### Code Blocks

Code blocks are automatically highlighted:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

## Managing Your Wiki

### Adding Files

To add a new page to your wiki:

1. Create a new `.mdx` file in the `app/docs/` directory.
2. Start writing your content using Markdown and MDX syntax.
3. The file will automatically appear in your wiki's structure.

### Removing Files

To remove a page:

1. Simply delete the `.mdx` file from the `app/docs/` directory.
2. The page will be automatically removed from your wiki's structure.

### Organizing Files

You can create subdirectories within `app/docs/` to organize your content hierarchically. For example:

```plaintext
app/docs/
├── getting-started.mdx
├── advanced-topics/
│   ├── customization.mdx
│   └── api-integration.mdx
└── tutorials/
    ├── first-steps.mdx
    └── advanced-usage.mdx
```

## Start Exploring!

Now that you know the basics, start exploring and creating your own wiki pages. Remember, the power of Yet Another Wiki lies in its flexibility and ease of use. Happy documenting!