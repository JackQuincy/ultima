import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { FlagCreatePage } from "~/components/FlagCreatePage/FlagCreatePage";
import { setRawFlags } from "~/state/flagSlice";
import { setObjectiveMetadata } from "~/state/objectiveSlice";
import { RawFlagMetadata, setSchema } from "~/state/schemaSlice";
import { initItemMetadata } from "~/state/itemSlice";
import { ObjectiveMetadata } from "~/types/objectives";
import { FlagPreset } from "~/types/preset";
import { singletonStore } from "~/pages/_app";

export type PageProps = {
  objectives: ObjectiveMetadata;
  presets: Record<string, FlagPreset>;
  schema: Record<string, RawFlagMetadata>;
};

const Create = () => {

  const [objectives, setObjectives] = useState(null)
  const [presets, setPresets] = useState(null)
  const [schema, setSchemaLocal] = useState(null)
  const [version, setVersion] = useState(null)

  useEffect(() => {
    const store = singletonStore
    // fetch presets
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/presets`)
      .then((res) => res.json())
      .then((data) => {
        setPresets(data)
        
        const queryParameters = new URLSearchParams(window.location.search)
        const flagsParam = queryParameters.get("flags")
        if(flagsParam) {
          let base64 = flagsParam.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if necessary
          while (base64.length % 4 !== 0) {
            base64 += '=';
          }
          const buf = Buffer.from(base64, "base64")
          const flags = buf.toString("utf-8")
          console.log("Setting starting flags from query string")
          store.dispatch(setRawFlags(flags));
        } else {
          const preset = data["ultros league"];
          if (preset) {
            store.dispatch(setRawFlags(preset.flags));
          }
        }
      })
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/metadata/flag`)
      .then((res) => res.json())
      .then((data) => {
        setSchemaLocal(data)
        store.dispatch(setSchema(data))
      })

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/metadata/objective`)
      .then((res) => res.json())
      .then((data) => {
        setObjectives(data)
        store.dispatch(setObjectiveMetadata(data))
      })

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wc`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedVersion = data["version"]
        setVersion(fetchedVersion)
      })

    store.dispatch(initItemMetadata())
  }, [])

  if(objectives && presets && schema && version) {
    return(<FlagCreatePage objectives={objectives} presets={presets} schema={schema} version={version}/>)
  } else {
    return(<p>Loading...</p>)
  }
};

export default Create;
