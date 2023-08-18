import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UploadStep3.css';

function UploadStep3() {
    const [selectedPhotographer, setSelectedPhotographer] = useState('');
    const [customPhotographer, setCustomPhotographer] = useState('');
    const [showCustomPhotographerInput, setShowCustomPhotographerInput] = useState(false); const [selectedCollectorName, setSelectedCollectorName] = useState('');
    const [customCollectorName, setCustomCollectorName] = useState('');
    const [showCustomCollectorInput, setShowCustomCollectorInput] = useState(false);

    const collectors = ["Collector 1", "Collector 2"]; // Update with actual collector names
    const photographers = ["Testing John", "testing Jane"]; // Update with actual photographer names

    const handlePhotographerChange = (event) => {
        const value = event.target.value;
        setSelectedPhotographer(value);

        if (value === 'custom') {
            setShowCustomPhotographerInput(true);
        } else {
            setShowCustomPhotographerInput(false);
        }
    };

    const handleCustomPhotographerChange = (event) => {
        setCustomPhotographer(event.target.value);
    };

    const handleCollectorNameChange = (event) => {
        const value = event.target.value;
        setSelectedCollectorName(value);

        if (value === 'custom') {
            setShowCustomCollectorInput(true);
        } else {
            setShowCustomCollectorInput(false);
        }
    };

    const handleCustomCollectorNameChange = (event) => {
        setCustomCollectorName(event.target.value);
    };

    return (
        <div className="upload-step-container">
            <div className="upload-step-left">
                <h2>Upload Steps:</h2>
                <ol>
                    <li><Link to="/Upload">Step 1 - Adding Observations</Link> </li>
                    <li><Link to="/UploadStep2">Step 2 - Grouping Observations</Link></li>
                    <li><Link to="/UploadStep3">Step 3 - Adding Information</Link></li>
                </ol>
            </div>
            <div className="upload-step-center">
                <h2>Add Information</h2>
                <button>Open Maps for selected image</button>
                {/* Rest of the center content */}
            </div>
            <div className="upload-step-right">
                <h1>Basic Info</h1>
                <p id="userName">User name: Testing John</p>
                <label htmlFor="namesDropdown">Photographer Name:</label>
                <select
                    id="namesDropdown"
                    value={selectedPhotographer}
                    onChange={handlePhotographerChange}
                >
                    {photographers.map((photographer) => (
                        <option key={photographer} value={photographer}>
                            {photographer}
                        </option>
                    ))}
                    <option value="custom">Custom</option>
                </select>
                {showCustomPhotographerInput && (
                    <div id="customInputContainer">
                        <label htmlFor="customInput">Enter new Photographer's name:</label>
                        <input
                            type="text"
                            id="customInput"
                            value={customPhotographer}
                            onChange={handleCustomPhotographerChange}
                        />
                    </div>
                )}
                <div className="input-group">
                    <label htmlFor="imageDate">Date:</label>
                    <input type="text" id="imageDate" name="imageDate" />
                </div>

                <div className="input-group">
                    <label htmlFor="colName">Collectors Name:</label>
                    <select
                        id="colName"
                        name="colName"
                        value={selectedCollectorName}
                        onChange={handleCollectorNameChange}
                    >
                        {collectors.map((collectorName) => (
                            <option key={collectorName} value={collectorName.toLowerCase()}>
                                {collectorName}
                            </option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div id="colCustom" style={{ display: showCustomCollectorInput ? 'block' : 'none' }}>
                    <label htmlFor="colCustom-input">Enter new Collectors name:</label>
                    <input
                        type="text"
                        id="colCustom-input"
                        value={customCollectorName}
                        onChange={handleCustomCollectorNameChange}
                    />
                </div>
                <hr />
                <h1>Coordinates</h1>
                <div className="input-group">
                    <label htmlFor="latNumber">Latitude:</label>
                    <input type="text" id="latNumber" name="latNumber" />
                </div>
                <div className="input-group">
                    <label htmlFor="longNumber">Longitude:</label>
                    <input type="text" id="longNumber" name="longNumber" />
                </div>
                <div className="input-group">
                    <label htmlFor="altNumber">Altitude:</label>
                    <input type="text" id="altNumber" name="altNumber" />
                </div>
                <hr />
                <h1>Locality</h1>
                <div className="input-group">
                    <label htmlFor="locCount">Country:</label>
                    <input type="text" id="locCount" name="locCount" />
                </div>
                <div className="input-group">
                    <label htmlFor="locPro">Province:</label>
                    <input type="text" id="locPro" name="locPro" />
                </div>
                <div className="input-group">
                    <label htmlFor="minLoc">Minor Locality:</label>
                    <input type="text" id="minLoc" name="minLoc" />
                </div>
                <div className="input-group">
                    <label htmlFor="preLoc">Precise Locality:</label>
                    <input type="text" id="preLoc" name="preLoc" />
                </div>
                <button>Submit information for selected image</button>
                <button>finalise</button>
            </div>
        </div >
    );
}

export default UploadStep3;
