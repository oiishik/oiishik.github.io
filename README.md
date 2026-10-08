# SDE 2

Portfolio site for Oishik Sengupta, built as a fictional "Manage Booking" flow for the carrier SDE.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Publish to oiishik.github.io

This address only works from a GitHub repository named `oiishik.github.io`.

1. Create an empty public repository: `github.com/oiishik/oiishik.github.io`.
2. Push this project to the `main` branch.
3. In the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it. Direct links such as `/booking` work because the build also writes `404.html`.

The site will be at [https://oiishik.github.io](https://oiishik.github.io).
