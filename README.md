Publish Android App Bundle to Google Play

```bash
$ npm install -g publish-aab-google-play
$ publish-aab-google-play --help
```

```bash
Usage: publish-aab-google-play [options]

Publish Android App Bundle to Google Play

Options:
  -k, --keyFile <path>      set google api json key file
  -p, --packageName <name>  set package name (com.some.app)
  -a, --aabFile <path>      set path to .aab file
  -t, --track <track>       set track (production, beta, alpha...)
  -c, --changesNotSentForReview true   set changesNotSentForReview flag
  -s  --status              set status at the store i.e draft, completed
  -e, --exit                exit on error with error code 1.
  -h, --help                output usage information
```

*Example:* 

```bash
$ publish-aab-google-play -k ./api-publish.json -p com.laCosaNostra.FiveHundredAndTwelve2 -a ./platforms/android/app/build/outputs/bundle/release/app.aab -t beta -c true
```

**Use in your own program**

```typescript
import { publish } from "publish-aab-google-play";

publish({
  keyFile: "./api-publish.json",
  packageName: "com.laCosaNostra.FiveHundredAndTwelve2",
  aabFile: "./platforms/android/app/build/outputs/bundle/release/app.aab",
  track: "beta"
})
  .then(() => {
    console.log("Success");
  })
  .catch(error => {
    console.error(error);
  });
```