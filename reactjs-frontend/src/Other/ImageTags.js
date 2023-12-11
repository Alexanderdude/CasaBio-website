import React from "react";

const ImageTags = ({ checkboxValues, setCheckboxValues, subjectCheckBox, setSubjectCheckBox }) => {

        // Event handler to toggle checkbox values
        const handleCheckBoxChange = (event) => {
            const { name, checked } = event.target;
            setCheckboxValues({
                ...checkboxValues,
                [name]: checked,
            });
    
        };
        // Event handler to toggle checkbox values
        const handleSubjectCheckBoxChange = (event) => {
            const { name, checked } = event.target;
            setSubjectCheckBox({
                ...subjectCheckBox,
                [name]: checked,
            });
        };

    return (
        <div>
            <h1>Tags:</h1>

            {/* creates a container for the checkboxes */}
            <div className="checkbox-container">

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="drawingPaint"
                            checked={checkboxValues.drawingPaint}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Painting or Drawings
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="literature"
                            checked={checkboxValues.literature}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Literature

                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="invaSpec"
                            checked={checkboxValues.invaSpec}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Invasive species
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="dying"
                            checked={checkboxValues.dying}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Dying/Stressed
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="dead"
                            checked={checkboxValues.dead}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Dead/Mortality
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="barkStrip"
                            checked={checkboxValues.barkStrip}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Bark-stripped
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="camTrap"
                            checked={checkboxValues.camTrap}
                            onChange={handleCheckBoxChange}
                        />
                    </span>Camera trap
                </label>

            </div>

            <hr />

            <h1>Subject:</h1>

            {/* creates a container for the checkboxes */}
            <div className="checkbox-container">

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="people"
                            checked={subjectCheckBox.people}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>People
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="landscape"
                            checked={subjectCheckBox.landscape}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>Landscape
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="dissection"
                            checked={subjectCheckBox.dissection}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>Dissection
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="exSitu"
                            checked={subjectCheckBox.exSitu}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>Ex-situ
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="pollinator"
                            checked={subjectCheckBox.pollinator}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>Pollinator
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="plant"
                            checked={subjectCheckBox.plant}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>Plant
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="wholePlant"
                            checked={subjectCheckBox.wholePlant}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Whole plant
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="flowerBranch"
                            checked={subjectCheckBox.flowerBranch}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Flowering branch
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="flower"
                            checked={subjectCheckBox.flower}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Flower
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="fruitCap"
                            checked={subjectCheckBox.fruitCap}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span> -Fruit/Capsule
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="herbarium"
                            checked={subjectCheckBox.herbarium}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Herbarium specimen
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="bark"
                            checked={subjectCheckBox.bark}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Bark/stem
                </label>

                {/* creates a label for each checkbox */}
                <label className="checkbox-label">

                    {/* create the checkbox itself with set variables */}
                    <span className="checkbox-input">
                        <input
                            type="checkbox"
                            name="leaf"
                            checked={subjectCheckBox.leaf}
                            onChange={handleSubjectCheckBoxChange}
                        />
                    </span>-Leaf
                </label>

            </div>
        </div>
    );
};

export default ImageTags;