# Contributing to SunbirdEd-Portal

Thank you for your interest in contributing! This guide covers how to set up the project locally, with special attention to **Windows users** and common pitfalls.

---

## Quick Start (TL;DR)

```bash
git clone https://github.com/Sunbird-Ed/SunbirdEd-portal.git
cd SunbirdEd-portal

# Install and build the Angular client
cd src/app/client
yarn install
yarn start

# Install and start the Node server
cd ../
yarn install
yarn server
```

> ⚠️ If you are using Windows, read the [Windows-Specific Notes](#windows-specific-notes) section before running commands.

---

## Table of Contents

- [Quick Start (TL;DR)](#quick-start-tldr)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Step 1 — Clone the Repository](#step-1--clone-the-repository)
  - [Step 2 — Install yarn (if not already installed)](#step-2--install-yarn-if-not-already-installed)
  - [Step 3 — Install Client Dependencies](#step-3--install-client-dependencies)
  - [Step 4 — Build the Angular Client](#step-4--build-the-angular-client)
  - [Step 5 — Install Server Dependencies](#step-5--install-server-dependencies)

  - [Step 6 — Start the Node Server](#step-6--start-the-node-server)
- [Windows-Specific Notes](#windows-specific-notes)
- [Common Issues & Fixes](#common-issues--fixes)
- [Environment Variables](#environment-variables)

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | 18.x LTS (recommended) | Node 20+ may have native module compatibility issues |
| **yarn** | 1.x (Classic) | Install via `npm install -g yarn` |
| **Git** | Any recent version | |
| **Angular CLI** | 14.x+ | Installed automatically via `yarn install` |

> **Windows users:** Node.js 22+ (v24+) requires Visual Studio Build Tools with the "Desktop development with C++" workload to compile certain native addons (`canvas`, `iltorb`, `snappy`). These addons are **optional** — the server will start without them.

---

## Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Sunbird-Ed/SunbirdEd-portal.git
cd SunbirdEd-portal
```

### Step 2 — Install yarn (if not already installed)

The project uses `yarn` as its package manager. If `yarn` is not found on your system:

```bash
npm install -g yarn
```

Verify:

```bash
yarn --version
```

### Step 3 — Install Client Dependencies

```bash
cd src/app/client
yarn install
```

> **Note:** You may see warnings about optional native modules (`iltorb`, `canvas`) failing to compile on Windows. These are safe to ignore — they are compression/rendering addons that are not required for the server to start.

> **Note on `esbuild`:** If `yarn install` exits with code 1 due to native build failures, `esbuild` may not have been installed. Run the following to install it manually:
> ```bash
> npm install esbuild --save-dev --legacy-peer-deps
> ```

### Step 4 — Build the Angular Client

**Linux / macOS:**

```bash
npm run start
```

**Windows (PowerShell):**

The `npm run start` script internally uses the Unix `mv` command which is not available on Windows. Run the build manually:

```bash
# Build the Angular app
npx ng build --deploy-url dist/

# Then rename the output file (PowerShell equivalent of `mv`)
Move-Item -Path "..\dist\index.html" -Destination "..\dist\index.ejs" -Force
```

> **Note on `caniuse-lite`:** If the build fails with `BrowserslistError: Unknown version X of chrome`, your bundled browser compatibility database is outdated. Fix it by running:
> ```bash
> npm install caniuse-lite --legacy-peer-deps
> ```

### Step 5 — Install Server Dependencies

```bash
cd ../   # Navigate to src/app
yarn install
```

> **Windows users:** Optional native modules (`snappy`) may fail to compile — this is expected and safe to ignore.

### Step 6 — Start the Node Server

Set the required environment variables and start the server:

**Linux / macOS:**

```bash
export sunbird_environment=local
export sunbird_instance=sunbird
yarn server
```

**Windows (PowerShell):**

```powershell
$env:sunbird_environment = 'local'
$env:sunbird_instance = 'sunbird'
yarn server
```

The server will start at **http://localhost:3000**.

---

## Windows-Specific Notes

| Issue | Cause | Fix |
|---|---|---|
| `'mv' is not recognized` | `npm run start` uses Unix `mv` command | Use `Move-Item` in PowerShell (see Step 4) |
| `yarn` not found | yarn not globally installed | Run `npm install -g yarn` |
| `esbuild` module not found | Native build failure skipped esbuild install | Run `npm install esbuild --save-dev --legacy-peer-deps` |
| `BrowserslistError: Unknown version X of chrome` | Outdated `caniuse-lite` in lockfile | Run `npm install caniuse-lite --legacy-peer-deps` |
| `gyp ERR! find VS` during `yarn install` | Native C++ addons require Visual Studio Build Tools | These addons are optional; ignore the warning |
| `canvas.node` not found | `canvas` native module not compiled | Optional — only needed for LaTeX PNG rendering |

---

## Common Issues & Fixes

### `yarn install` exits with code 1

This usually means an optional native addon (`iltorb`, `canvas`, `snappy`) failed to compile. The important packages are still installed. You can verify by checking whether `node_modules/@angular` exists:

```bash
ls src/app/client/node_modules/@angular
```

If it exists, the install was successful enough to proceed.

### `Cannot find module 'esbuild'`

```bash
cd src/app/client
npm install esbuild --save-dev --legacy-peer-deps
```

### Build fails with `BrowserslistError: Unknown version X of chrome`

Your local Chrome version is newer than the `caniuse-lite` database bundled in the lockfile.

```bash
cd src/app/client
npm install caniuse-lite --legacy-peer-deps
```

---

## Environment Variables

Copy `src/app/example.env` to `src/app/.env` and fill in the values:

```bash
# Linux/macOS
cp src/app/example.env src/app/.env

# Windows (PowerShell)
Copy-Item src/app/example.env src/app/.env
```

| Variable | Description | Required |
|---|---|---|
| `sunbird_environment` | Deployment environment (e.g., `local`) | Yes |
| `sunbird_instance` | Instance name (e.g., `sunbird`) | Yes |
| `sunbird_default_token` | Default API token | Yes |
| `sunbird_cloud_storage_provider` | Cloud provider (`azure`, `aws`, `gcp`, `oci`) | Yes (for cloud features) |
| `cloud_private_storage_accountname` | Cloud storage account name | For cloud features |
| `cloud_private_storage_secret` | Cloud storage account key | For cloud features |
| `sb_domain` | Application domain | For cloud features |

> For the full list of environment variables, refer to the [Confluence wiki](https://project-sunbird.atlassian.net/wiki/spaces/SP/pages/3353378817/Portal+-+Min+environment+variables).

---

## Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes and ensure tests pass: `yarn test:ci`
4. Ensure linting passes: `yarn lint`
5. Commit with a clear message following [Conventional Commits](https://www.conventionalcommits.org/)
6. Open a Pull Request against the `master` branch

---

*For questions, open an [issue](https://github.com/Sunbird-Ed/SunbirdEd-portal/issues) or join the [Sunbird community](https://community.sunbird.org/).*
