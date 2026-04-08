## Quick notes regarding uploading CORS policy to s3 bucket

see more details here [Cloud reg.ru](https://reg.cloud/support/instrukcii/obektnoe-hranilishe-s3/nastrojka-cors-dlya-dostupa-k-obektam-s3?utm_source=reg.cloud&utm_medium=organic&utm_content=%2Fsupport%2Finstrukcii%2Fobektnoe-hranilishe-s3%2Fnastrojka-cors-dlya-dostupa-k-obektam-s3&utm_campaign=reg.cloud#2)

```
aws s3api put-bucket-cors --bucket altexweb-images --cors-configuration file://cors-config.json
```
