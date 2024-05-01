import React, { useState,useEffect } from "react";
import axios from "axios"; // Import Axios

function FileUpload({userInfo,all}) {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // New state to track the uploaded file
  const allaccess=all;
  useEffect(() => {
    const fetchExistingFile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/file/check-file/${userInfo.data.uid}`
        );
        if (response.data.fileExists) {
          setUploadedFile(response.data.file);
          console.log(response.data.file);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchExistingFile();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", userInfo.data.uid);

    try {
      const response = await axios.post(
        "http://localhost:9000/file/upload/single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setUploadedFile(file); // Update the uploadedFile state with the uploaded file
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    if (!uploadedFile) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:9000/file/download/${userInfo.data.uid}`,
        {
          responseType: "blob",
        }
      );
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", uploadedFile.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {
        !allaccess&&(
          <>
          <input
        type="file"
        id="profileFileUpload"
        onChange={handleFileChange}
        style={{
          padding: "8px 12px",
          border: "1px solid #ced4da",
          borderRadius: "4px",
          fontSize: "14px",
          marginRight: "10px",
        }}
      />
      <button
        onClick={handleUpload}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#0056b3";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#007bff";
        }}
      >
        Upload
      </button></>
        )
      }

      {uploadedFile && (
        <div>
          {/* <p>Uploaded file: {uploadedFile.name}</p> */}
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              marginLeft: "10px",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
            }}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      )}
      {uploadedFile &&(
        <p style={{ marginLeft: "16px" }}>File exists</p>
      )}
    </div>
  );
}
export default FileUpload;