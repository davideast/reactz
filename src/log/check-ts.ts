import { errorLog, log } from './';

export function logTsconfigError() {
  errorLog(`No tsconfig.json exists at the root of your current working directory (cwd). While serve-react tries to be as "zero-config" as possible, we require a tsconfig.json at the moment. 
  
  🔧 ---- HOW TO FIX ---- 🔧
  Create a tsconfig.json at the root of your cwd and copy and paste the example config below to get started. Note you may need to tweak this config to fit your requirements.\n`);
  log(`tsconfig.json
---------------------------------------------
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
  }
}\n`);
}
