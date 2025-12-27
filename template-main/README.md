# %REPOSITORY_NAME% <!-- TODO -->

> [!CAUTION]
> Currently WIP. Do not use in production.

## Development

### Prerequisites

- [mise](https://mise.jdx.dev)
- [Podman](https://podman.io) or Docker
  - Requires Podman engine only. Podman Desktop is optional.

### Run local server

First, start Podman daemon.

Then run the following commands:

```sh
cd /path/to/%projectname%
cp ./.env.example ./.env
mise install
mise dev
```

Now the application should be served via http://localhost:3000.

Min.io's dashboard is also available via http://localhost:9001.

<!-- ▼▼ TODO Remove this section if the project is UNLICENSED ▼▼ -->
## License & Credits

Licensed under the [%LICENSE_NAME% License](./LICENSE.txt).

This repository includes the code derived from the following opensource projects:

- [%PRODUCT_NAME%](https://github.com/%ORG_OR_USER%/%REPO%) licensed under %LICENSE_NAME%, created by [%AUTOHR%](%https://author-page.example.com%) and its [contributors](https://github.com/%ORG_OR_USER%/%REPO%/graphs/contributors).
<!-- ▲▲ TODO Remove the following section if the project is UNLICENSED ▲▲ -->
