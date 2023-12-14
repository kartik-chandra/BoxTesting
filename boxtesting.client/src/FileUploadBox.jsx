import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUploadBox = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        const accessToken = "gtYMEnSx7iIp4DnjB43TT0Bo7ndViZ5V";

        // Upload the file to Box.com
        const formData = new FormData();
        formData.append('attributes', JSON.stringify({ name: acceptedFiles[0].name, parent: { id: "238550335179" } }));
        formData.append('file', file);

        try {
            await axios.post('https://upload.box.com/api/2.0/files/content', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // File uploaded successfully
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file to Box.com:', error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p style={{ width: "250px" }}>Drag & drop a file here, or click to select a file</p>
            </div>
        </div>
    );
};

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    height: '100px'
};

export default FileUploadBox;
