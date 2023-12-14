import { useState } from 'react';
import axios from 'axios';

const BoxHelper = () => {
    const [folderId, setFolderId] = useState('238550335179');
    const [accessToken, setAccessToken] = useState('fDOWnF3e1ADNn12snHmfaK1zmQYU917n');
    const [selectedFile, setSelectedFile] = useState(null);

    const [selectedFileSession, setSelectedFileSession] = useState(null);
    const [result, setResult] = useState('');
    
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

    const handleUploadButtonClickSession = async () => {
        createUploadSession();
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
            /*setResult(JSON.stringify(responseData));*/
            setResult('Upload session created successfully');
        } catch (error) {
            console.error('Error creating upload session:', error);
        }
    }

    async function uploadFileChunk(uploadSessionId, startByte, endByte) {

        const apiUrl = `https://upload.box.com/api/2.0/files/upload_sessions/${uploadSessionId}`;

        const digestValue = 'sha=fpRyg5eVQletdZqEKaFlqwBXJzM='; // Replace with the actual digest value

        const contentRangeHeader = `bytes ${startByte}-${endByte}/${selectedFile.size}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Digest': digestValue,
                    'Content-Range': contentRangeHeader,
                    'Content-Type': 'application/octet-stream',
                },
                body: selectedFile,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('File chunk uploaded successfully:', responseData);
        } catch (error) {
            console.error('Error uploading file chunk:', error);
        }
    }

    async function commitUploadSession(uploadSessionId) {

        const apiUrl = `https://upload.box.com/api/2.0/files/upload_sessions/${uploadSessionId}/commit`;

        const commitData = {
            parts: [
                {
                    part_id: 'BFDF5379',
                    offset: 0,
                    size: 8388608,
                    sha1: '134b65991ed521fcfe4724b7d814ab8ded5185dc',
                },
                {
                    part_id: 'E8A3ED8E',
                    offset: 8388608,
                    size: 1611392,
                    sha1: '234b65934ed521fcfe3424b7d814ab8ded5185dc',
                },
            ],
            attributes: {
                content_modified_at: '2017-04-08T00:58:08Z',
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
                <button className={"btn"} onClick={handleUploadButtonClickSession}>Get Session</button>
                <hr />
                <div>{result}</div>
            </div>
        </div>
    );
};

export default BoxHelper;
