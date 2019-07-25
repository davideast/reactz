import { errorLog } from './';

export function logNoServingDirError() {
  const message = `No serving directory specified!

serve-react needs know two things:

1) Serving directory. This is where your static assets are (index.html, styles.css, etc...).
   ex: serve-react static

2) Entry file for webpack. serve-react will look for an index.{js,tsx} file in the serving directory if no file is provided.
    ex: serve-react static -e src/index.js
`;
  errorLog(message);
}
