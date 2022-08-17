import { setup, isSupported } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";
import { useEffect, useState } from "react";

const PUBLIC_APP_ID = "52d120ad-e856-4e9b-8a50-7ac2cb2a8033";
const BUTTON_ID = "loom-record-sdk-button";

export default function App() {
  const [videoHTMLs, setVideoHTMLs] = useState([]);
  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        publicAppId: PUBLIC_APP_ID,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
      
        //here you could call a mutation to persist the video information
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        console.error('dddd', video);
        let newHTMLs = [];
        newHTMLs.concat(videoHTMLs);
        newHTMLs.push(html);
        setVideoHTMLs(newHTMLs);
      });
    }

    setupLoom();
  }, []);

  return (
    <div>
      <button id={BUTTON_ID}>Record</button>
      {videoHTMLs.map( html => <div dangerouslySetInnerHTML={{ __html: html }}></div>)}
    </div>
  );
}

