import { useState } from 'react';
import axios from 'axios';

const BoxHelper = () => {
    const [folderId, setFolderId] = useState('238550335179');
    const [accessToken, setAccessToken] = useState('FI1p14QF8kX0SgrB4P3cZWIlwpByu9Ma');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileSession, setSelectedFileSession] = useState(null);
    const [result, setResult] = useState('');
    const [progress, setProgress] = useState('');

    const textStyle = {
        overflowWrap: 'break-word',
        maxWidth: '450px'

    };
    
    const handleFileChangeSession = (event) => {
        const fileSession = event.target.files[0];
        setSelectedFileSession(fileSession);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleFolderIdChange = (event) => {
        setFolderId(event.target.value);
    };
        
    const handleAccessTokenChange = (event) => {
        setAccessToken(event.target.value);
    };

    const handleUploadButtonClick = async () => {
        uploadSimpleFile();
    };

    const handleMultiPartFileUpload = async () => {
        uploadFileInMultiPart();
    };

    async function uploadSimpleFile() {
        const formData = new FormData();
        formData.append('attributes', JSON.stringify({ name: selectedFile.name, parent: { id: folderId } }));
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('https://upload.box.com/api/2.0/files/content', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    async function uploadFileInMultiPart() {
        var uploadSession = await createUploadSession();

        let responses = [];
        let totalSize = selectedFileSession.size;
        let startByte = 0;
        
        while (totalSize > startByte) {
            let endByte = (startByte + uploadSession.part_size);
            if (endByte > totalSize) {
                endByte = totalSize;
            }
            
            var partResponse = await uploadFileChunk(uploadSession.id, startByte, endByte, totalSize);
            responses.push(partResponse);
            
            setProgress(`Uploaded ${endByte} of ${totalSize}`);
            startByte = endByte;
        }

        const uploadResult = await commitUploadSession(uploadSession.id, responses);
        console.log(uploadResult);        
    }

    async function createUploadSession() {
        const apiUrl = 'https://upload.box.com/api/2.0/files/upload_sessions';
        const requestData = {
            folder_id: folderId,
            file_size: selectedFileSession.size,
            file_name: selectedFileSession.name,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Upload session created successfully:', responseData);
            setResult(JSON.stringify(responseData));
            return responseData;
        } catch (error) {
            console.error('Error creating upload session:', error);
        }
    }

    async function uploadFileChunk(uploadSessionId, startByte, endByte, totalSize) {
        const apiUrl = `https://upload.box.com/api/2.0/files/upload_sessions/${uploadSessionId}`;

        const digestValue = 'sha=fpRyg5eVQletdZqEKaFlqwBXJzM='; // Replace with the actual digest value

        const contentRangeHeader = `bytes ${startByte}-${endByte}/${totalSize}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Digest': digestValue,
                    'Content-Range': contentRangeHeader,
                    'Content-Type': 'application/octet-stream',
                },
                body: selectedFileSession,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('File chunk uploaded successfully:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error uploading file chunk:', error);
        }
    }

    async function commitUploadSession(uploadSessionId, parts) {
        const currentDate = new Date();

        const apiUrl = `https://upload.box.com/api/2.0/files/upload_sessions/${uploadSessionId}/commit`;

        const commitData = {
            parts: parts,
            attributes: {
                content_modified_at: currentDate,
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Digest': 'sha=fpRyg5eVQletdZqEKaFlqwBXJzM=',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commitData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Upload session committed successfully:', responseData);

            return responseData;
        } catch (error) {
            console.error('Error committing upload session:', error);
        }
    }

    return (
        <div>
            <div>
                <label>
                    Folder ID:
                    <input type="text" value={folderId} onChange={handleFolderIdChange} />
                </label>
                <label>
                    Access Token:
                    <input type="text" value={accessToken} onChange={handleAccessTokenChange} />
                </label>
            </div>

            <div style={{ marginTop: "50px" }}>
                <input type="file" onChange={handleFileChange} />                
                <hr />
                <button className={"btn"} onClick={handleUploadButtonClick}>Upload File</button>
            </div>

            <div style={{ marginTop: "50px" }}>
                <input type="file" onChange={handleFileChangeSession} />
                <button className={"btn"} onClick={handleMultiPartFileUpload}>Upload Multipart</button>
                <hr />
                <div>{progress}</div>
                <div style={textStyle}>{result}</div>
            </div>
        </div>
    );
};

export default BoxHelper;
