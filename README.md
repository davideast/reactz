**Status**: Total experiment

# serve-react

> A simple dev server for React.

## Usage

```bash
react-serve public
```

## Checklist

react-serve checklist
--------------------------------------------------------
- [ ] Better start up messaging for devs to understand how the server is resolving files
- [ ] Allow for a custom built directory for in memory build
- [ ] Error message for no serving directory
- [ ] Warning message about needing a tsconfig.json
- [ ] Use the local webpack.config.js if exists
- [ ] Allow for a custom webpack config name
- [ ] Allow for a custom tsconfig.json name
- [ ] Indicate where the serving is resolving files per request
- [ ] Provide a --dev flag for webpack build
- [ ] Provide a --prod flag for webpack build
- [ ] Provide a --watch flag
- [ ] Provide a --hot flag for HMR
- [ ] Provide a --build flag to write build to disk
- [ ] Provide a --tailwind flag for tailwind builds
- [ ] Provide a --emotion flag for emotion usage
- [ ] Handle rewrites
- [ ] Handle redirects
