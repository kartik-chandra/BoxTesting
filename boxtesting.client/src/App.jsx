import './App.css';
import BoxHelper from './BoxHelper'
import FileUploadBox from './FileUploadBox';

function App() {

    const myStyle = {
        marginTop: '50px',
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
    };

    return (
        <div>
            <h3>Box API [with React.JS]</h3>
            <hr style={{ marginTop: "-15px" }} />

            <div style={{ marginTop: "25px" }}>
                <div>
                    <FileUploadBox />
                </div>

                <div style={myStyle}>
                    <BoxHelper />
                </div>
            </div>
        </div>
    );
}

export default App;