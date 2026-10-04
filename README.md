# React + TypeScript + Vite

## Deploy com Docker

O frontend é compilado pelo Vite, servido por Nginx no container e publicado somente em `127.0.0.1:8081` na VPS. O gateway do `lifesystems-infra` encaminha a raiz do domínio para esse container e mantém `/ivcf-api` reservado ao backend.

O workflow `.github/workflows/deploy.yaml` publica a imagem no GHCR e implanta na VPS. `chore/prod` usa o GitHub Environment `prod`; `dev` usa `dev`.

Configure em cada GitHub Environment:

- secret `ENV_PROD_FILE`, baseado em `.env.prod.example`;
- secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_HOST_FINGERPRINT`, `VPS_SSH_PORT` e `VPS_APP_PATH`;
- secrets `GHCR_USER` e `GHCR_PAT`, com permissão para baixar a imagem privada;
- variável `VITE_API_URL`, normalmente `/ivcf-api`.

O valor de `VITE_API_URL` é incorporado ao bundle durante o build; alterá-lo exige gerar uma nova imagem. Para desenvolvimento local, copie `.env.example` para `.env`.

Prepare uma vez o diretório configurado em `VPS_APP_PATH`:

```sh
sudo mkdir -p /opt/ivcf-front
sudo chown "$USER":"$USER" /opt/ivcf-front
```

Depois de subir o frontend, atualize o `lifesystems-infra` e valide `GET /`, `GET /healthz` e `GET /ivcf-api/status` pelo gateway.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
