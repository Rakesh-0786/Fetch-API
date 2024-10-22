import React, { useState } from "react";
import "../Resources/home.css";

function Home() {
  const [method, setMethod] = useState("OPTIONS");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [activeTab, setActiveTab] = useState("params");
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [statusCode, setStatusCode] = useState(null);

  const handleSend = async () => {
    let finalUrl = url;

    if (method === "GET" && activeTab === "params") {
      const queryParams = params
        .filter((param) => param.key && param.value)
        .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join("&");

      if (queryParams) {
        finalUrl += `?${queryParams}`;
      }
    }

    let options = {
      method: method,
    };

    if (method === "POST" && activeTab === "body" && body) {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = body;
    }

    try {
      const res = await fetch(finalUrl, options);
      const contentType = res.headers.get("content-type");
      const status = res.status;
      setStatusCode(status);

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      setStatusCode(null);
    }
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const removeParam = (index) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const getStatusClass = () => {
    if (statusCode >= 200 && statusCode < 300) {
      return "status-success";
    } else if (statusCode >= 400) {
      return "status-error";
    } else {
      return "";
    }
  };

  return (
    <div className="api-tester">
      <div className="method-url">
        <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          type="text"
          id="url"
          placeholder="Enter URL or paste text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button id="send-btn" onClick={handleSend}>Send</button>
      </div>

      <div className="tabs">
        <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
        <span className={`tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
        <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
        <span className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
        <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
        <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
      </div>

      {method === "GET" && activeTab === "params" && (
        <div className="params-box">
          {params.map((param, index) => (
            <div key={index} className="param-row">
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => handleParamChange(index, "key", e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => handleParamChange(index, "value", e.target.value)}
              />
              <button onClick={() => removeParam(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addParam}>Add Param</button>
        </div>
      )}

      {method !== "GET" && activeTab === "body" && (
        <div>
          <label htmlFor="body">JSON Body:</label>
          <textarea
            id="body"
            placeholder="Enter JSON data"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="10"
            style={{ width: "100%", marginTop: "10px" }}
          />
        </div>
      )}

      <div className="response-box">
        <label htmlFor="response">Response:</label>
        <textarea id="response" readOnly value={response}></textarea>
        {statusCode && (
          <div className={`status-code ${getStatusClass()}`}>
            {statusCode} {statusCode >= 200 && statusCode <300 ? "OK" : "Bad Request"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;



// add the status code with styling

// import React, { useState } from "react";
// import "../Resources/home.css";

// function Home() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [body, setBody] = useState("");
//   const [response, setResponse] = useState("");
//   const [statusCode, setStatusCode] = useState(null); // New state for status code
//   const [activeTab, setActiveTab] = useState("params");
//   const [params, setParams] = useState([{ key: "", value: "" }]);

//   const handleSend = async () => {
//     let finalUrl = url;

//     if (method === "GET" && activeTab === "params") {
//       const queryParams = params
//         .filter((param) => param.key && param.value)
//         .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
//         .join("&");

//       if (queryParams) {
//         finalUrl += `?${queryParams}`;
//       }
//     }

//     let options = {
//       method: method,
//     };

//     if (method === "POST" && activeTab === "body" && body) {
//       options.headers = {
//         "Content-Type": "application/json",
//       };
//       options.body = body;
//     }

//     try {
//       const res = await fetch(finalUrl, options);
//       const contentType = res.headers.get("content-type");

//       // Check the content type to determine how to handle the response
//       if (contentType && contentType.includes("application/json")) {
//         const data = await res.json();
//         setResponse(JSON.stringify(data, null, 2)); // Format the JSON response
//       } else {
//         const data = await res.text();
//         setResponse(data); // Set the response as plain text
//       }

//       setStatusCode(res.status); // Set the status code
//     } catch (error) {
//       setResponse(`Error: ${error.message}`);
//       setStatusCode(null); // Reset status code on error
//     }
//   };

//   const handleParamChange = (index, field, value) => {
//     const newParams = [...params];
//     newParams[index][field] = value;
//     setParams(newParams);
//   };

//   const addParam = () => {
//     setParams([...params, { key: "", value: "" }]);
//   };

//   const removeParam = (index) => {
//     setParams(params.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="api-tester">
//       <div className="method-url">
//         <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//           <option value="PUT">PUT</option>
//           <option value="PATCH">PATCH</option>
//           <option value="OPTIONS">OPTIONS</option>
//         </select>
//         <input
//           type="text"
//           id="url"
//           placeholder="Enter URL or paste text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button id="send-btn" onClick={handleSend}>Send</button>
//       </div>

//       <div className="tabs">
//         <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
//         <span className={`tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
//         <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
//         <span className={` tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
//         <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
//         <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
//       </div>

//       {/* Params tab */}
//       {method === "GET" && activeTab === "params" && (
//         <div className="params-box">
//           {params.map((param, index) => (
//             <div key={index} className="param-row">
//               <input
//                 type="text"
//                 placeholder="Key"
//                 value={param.key}
//                 onChange={(e) => handleParamChange(index, "key", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Value"
//                 value={param.value}
//                 onChange={(e) => handleParamChange(index, "value", e.target.value)}
//               />
//               <button onClick={() => removeParam(index)}>Remove</button>
//             </div>
//           ))}
//           <button onClick={addParam}>Add Param</button>
//         </div>
//       )}

//       {/* Body tab */}
//       {method !== "GET" && activeTab === "body" && (
//         <div>
//           <label htmlFor="body">JSON Body:</label>
//           <textarea
//             id="body"
//             placeholder="Enter JSON data"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows="10"
//             style={{ width: "100%", marginTop: "10px" }}
//           />
//         </div>
//       )}

//       <div className="response-container">
//         <label htmlFor="response">Response:</label>
//         <textarea id="response" readOnly value={response} style={{ height: "150px", width: "100%" }}></textarea>
//         {statusCode && (
//           <div className="status-code">
//             {statusCode}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;




// add the status code with both plain text and json text

// import React, { useState } from "react";
// import "../Resources/home.css";

// function Home() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [body, setBody] = useState("");
//   const [response, setResponse] = useState("");
//   const [activeTab, setActiveTab] = useState("params");
//   const [params, setParams] = useState([{ key: "", value: "" }]);

//   const handleSend = async () => {
//     let finalUrl = url;

//     if (method === "GET" && activeTab === "params") {
//       const queryParams = params
//         .filter((param) => param.key && param.value)
//         .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
//         .join("&");

//       if (queryParams) {
//         finalUrl += `?${queryParams}`;
//       }
//     }

//     let options = {
//       method: method,
//     };

//     if (method === "POST" && activeTab === "body" && body) {
//       options.headers = {
//         "Content-Type": "application/json",
//       };
//       options.body = body;
//     }

//     try {
//       const res = await fetch(finalUrl, options);
//       const status = res.status;
//       const contentType = res.headers.get("Content-Type");
//       let data;

//       if (contentType && contentType.includes("application/json")) {
//         data = await res.json();
//         setResponse(`Status: ${status}\n${JSON.stringify(data, null, 2)}`);
//       } else {
//         data = await res.text();
//         setResponse(`Status: ${status}\n${data}`);
//       }
//     } catch (error) {
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   const handleParamChange = (index, field, value) => {
//     const newParams = [...params];
//     newParams[index][field] = value;
//     setParams(newParams);
//   };

//   const addParam = () => {
//     setParams([...params, { key: "", value: "" }]);
//   };

//   const removeParam = (index) => {
//     setParams(params.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="api-tester">
//       <div className="method-url">
//         <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//           <option value="PUT">PUT</option>
//           <option value="PATCH">PATCH</option>
//           <option value="OPTIONS">OPTIONS</option>
//         </select>
//         <input
//           type="text"
//           id="url"
//           placeholder="Enter URL or paste text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button id="send-btn" onClick={handleSend}>Send</button>
//       </div>

//       <div className="tabs">
//         <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
//         <span className={`tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
//         <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
//         <span className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
//         <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
//         <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
//       </div>

//       {method === "GET" && activeTab === "params" && (
//         <div className="params-box">
//           {params.map((param, index) => (
//             <div key={index} className="param-row">
//               <input
//                 type="text"
//                 placeholder="Key"
//                 value={param.key}
//                 onChange={(e) => handleParamChange(index, "key", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Value"
//                 value={param.value}
//                 onChange={(e) => handleParamChange(index, "value", e.target.value)}
//               />
//               <button onClick={() => removeParam(index)}>Remove</button>
//             </div>
//           ))}
//           <button onClick={addParam}>Add Param</button>
//         </div>
//       )}

//       {method !== "GET" && activeTab === "body" && (
//         <div>
//           <label htmlFor="body">JSON Body:</label>
//           <textarea
//             id="body"
//             placeholder="Enter JSON data"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows="10"
//             style={{ width: "100%", marginTop: "10px" }}
//           />
//         </div>
//       )}

//       <div className="response-box">
//         <label htmlFor="response">Response:</label>
//         <textarea id="response" readOnly value={response} style={{ height: "150px", width: "100%" }}></textarea>
//       </div>
//     </div>
//   );
// }

// export default Home;


// it will support both plain text and json 
// import React, { useState } from "react";
// import "../Resources/home.css";

// function Home() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [body, setBody] = useState("");
//   const [response, setResponse] = useState("");
//   const [activeTab, setActiveTab] = useState("params");
//   const [params, setParams] = useState([{ key: "", value: "" }]);

//   const handleSend = async () => {
//     let finalUrl = url;

//     if (method === "GET" && activeTab === "params") {
//       const queryParams = params
//         .filter((param) => param.key && param.value)
//         .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
//         .join("&");

//       if (queryParams) {
//         finalUrl += `?${queryParams}`;
//       }
//     }

//     let options = {
//       method: method,
//     };

//     // Include the JSON body if the method is POST and the "Body" tab is active
//     if (method === "POST" && activeTab === "body" && body) {
//       options.headers = {
//         "Content-Type": "application/json",
//       };
//       options.body = body;
//     }

//     try {
//       const res = await fetch(finalUrl, options);

//       // Check if the response is JSON
//       const contentType = res.headers.get("content-type");
//       let data;

//       if (contentType && contentType.includes("application/json")) {
//         data = await res.json();
//         setResponse(JSON.stringify(data, null, 2)); // Format the JSON response
//       } else {
//         data = await res.text();
//         setResponse(data); // Handle as plain text
//       }
//     } catch (error) {
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   const handleParamChange = (index, field, value) => {
//     const newParams = [...params];
//     newParams[index][field] = value;
//     setParams(newParams);
//   };

//   const addParam = () => {
//     setParams([...params, { key: "", value: "" }]);
//   };

//   const removeParam = (index) => {
//     setParams(params.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="api-tester">
//       <div className="method-url">
//         <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//           <option value="PUT">PUT</option>
//           <option value="PATCH">PATCH</option>
//           <option value="OPTIONS">OPTIONS</option>
//         </select>
//         <input
//           type="text"
//           id="url"
//           placeholder="Enter URL or paste text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button id="send-btn" onClick={handleSend}>Send</button>
//       </div>

//       <div className="tabs">
//         <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
//         <span className={`tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
//         <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
//         <span className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
//         <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
//         <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
//       </div>

//       {/* Show the key-value input fields when the Params tab is active */}
//       {method === "GET" && activeTab === "params" && (
//         <div className="params-box">
//           {params.map((param, index) => (
//             <div key={index} className="param-row">
//               <input
//                 type="text"
//                 placeholder="Key"
//                 value={param.key}
//                 onChange={(e) => handleParamChange(index, "key", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Value"
//                 value={param.value}
//                 onChange={(e) => handleParamChange(index, "value", e.target.value)}
//               />
//               <button onClick={() => removeParam(index)}>Remove</button>
//             </div>
//           ))}
//           <button onClick={addParam}>Add Param</button>
//         </div>
//       )}

//       {/* Show the JSON input box when the Body tab is active */}
//       {method !== "GET" && activeTab === "body" && (
//         <div>
//           <label htmlFor="body">JSON Body:</label>
//           <textarea
//             id="body"
//             placeholder="Enter JSON data"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows="10"
//             style={{ width: "100%", marginTop: "10px" }}
//           />
//         </div>
//       )}

//       <div className="response-box">
//         <label htmlFor="response">Response:</label>
//         <textarea id="response" readOnly value={response} style={{ height: "150px", width: "100%" }}></textarea>
//       </div>
//     </div>
//   );
// }

// export default Home;




// it will support only json 

// import React, { useState } from "react";
// import "../Resources/home.css";

// function Home() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [body, setBody] = useState("");
//   const [response, setResponse] = useState("");
//   const [activeTab, setActiveTab] = useState("params");
//   const [params, setParams] = useState([{ key: "", value: "" }]);

//   const handleSend = async () => {
//     let finalUrl = url;

//     if (method === "GET" && activeTab === "params") {
//       const queryParams = params
//         .filter((param) => param.key && param.value)
//         .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
//         .join("&");

//       if (queryParams) {
//         finalUrl += `?${queryParams}`;
//       }
//     }

//     let options = {
//       method: method,
//     };

//     // Only include the JSON body if the method is POST and the "Body" tab is active
//     if (method === "POST" && activeTab === "body" && body) {
//       options.headers = {
//         "Content-Type": "application/json",
//       };
//       options.body = body;
//     }

//     try {
//       const res = await fetch(finalUrl, options);
//       const data = await res.json();
//       setResponse(JSON.stringify(data, null, 2)); // Format the JSON response
//     } catch (error) {
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   const handleParamChange = (index, field, value) => {
//     const newParams = [...params];
//     newParams[index][field] = value;
//     setParams(newParams);
//   };

//   const addParam = () => {
//     setParams([...params, { key: "", value: "" }]);
//   };

//   const removeParam = (index) => {
//     setParams(params.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="api-tester">
//       <div className="method-url">
//         <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//           <option value="PUT">PUT</option>
//           <option value="PATCH">PATCH</option>
//           <option value="OPTIONS">OPTIONS</option>
//         </select>
//         <input
//           type="text"
//           id="url"
//           placeholder="Enter URL or paste text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button id="send-btn" onClick={handleSend}>Send</button>
//       </div>

//       <div className="tabs">
//         <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
//         <span className={`tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
//         <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
//         <span className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
//         <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
//         <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
//       </div>

//       {/* Show the key-value input fields when the Params tab is active */}
//       {method === "GET" && activeTab === "params" && (
//         <div className="params-box">
//           {params.map((param, index) => (
//             <div key={index} className="param-row">
//               <input
//                 type="text"
//                 placeholder="Key"
//                 value={param.key}
//                 onChange={(e) => handleParamChange(index, "key", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Value"
//                 value={param.value}
//                 onChange={(e) => handleParamChange(index, "value", e.target.value)}
//               />
//               <button onClick={() => removeParam(index)}>Remove</button>
//             </div>
//           ))}
//           <button onClick={addParam}>Add Param</button>
//         </div>
//       )}

//       {/* Show the JSON input box when the Body tab is active */}
//       {method !== "GET" && activeTab === "body" && (
//         <div>
//           <label htmlFor="body">JSON Body:</label>
//           <textarea
//             id="body"
//             placeholder="Enter JSON data"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows="10"
//             style={{ width: "100%", marginTop: "10px" }}
//           />
//         </div>
//       )}

//       <div className="response-box">
//         <label htmlFor="response">Response:</label>
//         <textarea id="response" readOnly value={response} style={{ height: "150px", width: "100%" }}></textarea>
//       </div>
//     </div>
//   );
// }

// export default Home;




//  it add the json body in post method

// import React, { useState } from "react";
// import "../Resources/home.css";

// function Home() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [body, setBody] = useState("");
//   const [response, setResponse] = useState("");
//   const [activeTab, setActiveTab] = useState("");

//   const handleSend = async () => {
//     let options = {
//       method: method,
//     };

//     // Only include the JSON body if the method is POST and the "Body" tab is active
//     if (method === "POST" && activeTab === "body" && body) {
//       options.headers = {
//         "Content-Type": "application/json",
//       };
//       options.body = body;
//     }

//     try {
//       const res = await fetch(url, options);
//       const data = await res.json();
//       setResponse(JSON.stringify(data, null, 2)); // Format the JSON response
//     } catch (error) {
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="api-tester">
//       <div className="method-url">
//         <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//           <option value="PUT">PUT</option>
//           <option value="PATCH">PATCH</option>
//           <option value="OPTIONS">OPTIONS</option>
//         </select>
//         <input
//           type="text"
//           id="url"
//           placeholder="Enter URL or paste text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button id="send-btn" onClick={handleSend}>Send</button>
//       </div>

//       <div className="tabs">
//         <span className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>Params</span>
//         <span className={` tab ${activeTab === "authorization" ? "active" : ""}`} onClick={() => setActiveTab("authorization")}>Authorization</span>
//         <span className={`tab ${activeTab === "header" ? "active" : ""}`} onClick={() => setActiveTab("header")}>Header</span>
//         <span className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>Body</span>
//         <span className={`tab ${activeTab === "script" ? "active" : ""}`} onClick={() => setActiveTab("script")}>Script</span>
//         <span className={`tab ${activeTab === "setting" ? "active" : ""}`} onClick={() => setActiveTab("setting")}>Setting</span>
//       </div>

//       {/* Show the JSON input box when the Body tab is active */}
//       {activeTab === "body" && (
//         <div>
//           <label htmlFor="body">JSON Body:</label>
//           <textarea
//             id="body"
//             placeholder="Enter JSON data"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows="10"
//             style={{ width: "100%", marginTop: "10px" }}
//           />
//         </div>
//       )}

//       <div className="response-box">
//         <label htmlFor="response">Response:</label>
//         <textarea id="response" readOnly value={response} style={{ height: "150px", width: "100%" }}></textarea>
//       </div>
//     </div>
//   );
// }

// export default Home;
