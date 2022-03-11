import { ReadStream, createReadStream } from "fs";

import { google } from "googleapis";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

const getClient = (keyFile: string) =>
  google.auth.getClient({
    keyFile,
    scopes: "https://www.googleapis.com/auth/androidpublisher"
  });

const getAndroidPublisher = (
  client: ThenArg<ReturnType<typeof getClient>>,
  packageName: string
) =>
  google.androidpublisher({
    version: "v3",
    auth: client,
    params: {
      packageName
    }
  });

const startEdit = (
  androidPublisher: ReturnType<typeof getAndroidPublisher>,
  id: string
) =>
  androidPublisher.edits.insert({
    requestBody: {
      id,
      expiryTimeSeconds: "600"
    }
  });

const upload = (
  androidPublisher: ReturnType<typeof getAndroidPublisher>,
  editId: string,
  packageName: string,
  aab: ReadStream
) =>
  androidPublisher.edits.bundles.upload({
    editId,
    packageName,
    media: {
      mimeType: "application/octet-stream",
      body: aab
    }
  });

const setTrack = (
  androidPublisher: ReturnType<typeof getAndroidPublisher>,
  editId: string,
  packageName: string,
  track: string,
  versionCode: string
) =>
  androidPublisher.edits.tracks.update({
    editId,
    track: track,
    packageName,
    requestBody: {
      track: track,
      releases: [
        {
          status: "completed",
          versionCodes: [versionCode]
        }
      ]
    }
  });

const commit = (
  androidPublisher: ReturnType<typeof getAndroidPublisher>,
  editId: string,
  packageName: string,
  changesNotSentForReview: boolean
) =>
  androidPublisher.edits.commit({
    editId,
    packageName,
    changesNotSentForReview
  });

const getAABStream = (filePath: string) => createReadStream(filePath);
const getId = () => String(new Date().getTime());

interface SchemaPublish {
  keyFile: string;
  packageName: string;
  aabFile: string;
  track: string;
  changesNotSentForReview: boolean
}

export const publish = async ({
  keyFile,
  packageName,
  aabFile,
  track,
  changesNotSentForReview = false,
}: SchemaPublish) => {
  const client = await getClient(keyFile);
  const stream = getAABStream(aabFile);
  const androidPublisher = getAndroidPublisher(client, packageName);
  const id = getId();
  const edit = await startEdit(androidPublisher, id);
  const editId = String(edit.data.id);
  const bundle = await upload(androidPublisher, editId, packageName, stream);
  if (
    bundle.data.versionCode === undefined ||
    bundle.data.versionCode === null
  ) {
    throw new Error("Bundle versionCode cannot be undefined or null");
  }
  await setTrack(
    androidPublisher,
    editId,
    packageName,
    track,
    String(bundle.data.versionCode)
  );
  await commit(androidPublisher, editId, packageName, changesNotSentForReview);
};

