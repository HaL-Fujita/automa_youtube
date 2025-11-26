import { Composition } from "remotion";
import { BouncingExample, BouncingExampleSchema, BouncingExampleDefaultProps } from "./examples/BouncingExample";
import { LipSyncExample, LipSyncExampleSchema, LipSyncExampleDefaultProps } from "./examples/LipSyncExample";
import { SantoushinSakuyaExample } from "./examples/SantoushinSakuyaExample";
import { OutomakuVideo } from "./OutomakuVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* メインの口パク同期動画 */}
      <Composition
        id="OutomakuVideo"
        component={OutomakuVideo}
        durationInFrames={9925}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BouncingExample"
        component={BouncingExample}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        schema={BouncingExampleSchema}
        defaultProps={BouncingExampleDefaultProps}
      />
      <Composition
        id="LipSyncExample"
        component={LipSyncExample}
        durationInFrames={600}
        fps={30}
        width={1280}
        height={720}
        schema={LipSyncExampleSchema}
        defaultProps={LipSyncExampleDefaultProps}
      />
      <Composition
        id="SantoushinSakuyaExample"
        component={SantoushinSakuyaExample}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
