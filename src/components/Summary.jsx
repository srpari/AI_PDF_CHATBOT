import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";
import  Loader  from "./Loader";


function Summary({file}) {

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY });
const [summary, setSummary] = useState("");
const [status, setStatus] = useState("Generating summary...");

    async function generateSummary() {
     setStatus("loading");
     try{
        const contents = [
        { text:  `
          Summarize the document
          in one short paragraph (less than 100 words).
          Use just plain text with no markdowns or html tags
        `},
        {
            inlineData: {
                mimeType: file.type,
                data: file.file,
            }
        }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents
        });
        setStatus("success");
        setSummary(response.text);
     }
        catch(error){   
            setStatus("error");
            console.error("Error generating summary:", error);
        }
    }

    useEffect(() => {
        if (status === 'Generating summary...'){
          generateSummary();
        }
    },[status]);

    return (
      <section className="summary">
        <img src={file.imageUrl} alt="Uploaded file preview" height="400px" width="400px"/>
        <h2>Summary</h2>
        {status === "loading" ?
          <Loader /> :
          status === "success" ?
          <p>{summary}</p> :
          status === "error" ?
          <p>There was an error generating the summary. Please try again.</p> :
          <></>
        }
        
    </section>
    )
  }
  
  export default Summary