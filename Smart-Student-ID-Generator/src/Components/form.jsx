import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./form.css";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <React.StrictMode>
        <ErrorCatcher setHasError={setHasError}>{children}</ErrorCatcher>
        {hasError && (
          <div className="text-red-500 text-center mt-4">
            Something went wrong. Please try again.
          </div>
        )}
      </React.StrictMode>
    </React.Suspense>
  );
}

class ErrorCatcher extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("Caught error in boundary:", error, errorInfo);
    this.props.setHasError(true);
  }

  render() {
    return this.props.children;
  }
}

function Form() {
  const templates = ["/cardimage.jpg", "/cardimage1.png"];
  const [templateIndex, setTemplateIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    studentClass: "",
    classDivision: "",
    allergies: [],
    rackNumber: "",
    busRoute: "",
    photo: null,
    photoBase64: "",
    template: templates[0],
  });

  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [previousCards, setPreviousCards] = useState([]);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showform, setshowform] = useState(true);
  const cardRef = useRef();
  const previousRefs = useRef([]);

  const allergyOptions = [
    { value: "Peanuts", label: "Peanuts" },
    { value: "Gluten", label: "Gluten" },
    { value: "Dust", label: "Dust" },
    { value: "Pollen", label: "Pollen" },
    { value: "Milk", label: "Milk" },
  ];

  const divisionOptions = ["A", "B", "C", "D"].map((d) => ({
    value: d,
    label: d,
  }));
  const busRouteOptions = ["Route 1", "Route 2", "Route 3"].map((route) => ({
    value: route,
    label: route,
  }));

  useEffect(() => {
    const saved = localStorage.getItem("studentFormData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            photo: file,
            photoBase64: reader.result,
          }));
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const downloadPreviousCardAsImage = (index, name) => {
    const node = previousRefs.current[index];
    if (!node) return;

    // Find and hide the buttons inside this card before capture
    const buttons = node.querySelector(".card-buttons");
    if (buttons) buttons.style.display = "none";

    toPng(node, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${name}_ID_Card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Error downloading previous card:", err);
      })
      .finally(() => {
        if (buttons) buttons.style.display = "block"; // Restore buttons
      });
  };

  const handleSubmit = (e) => {
    setshowform(false);
    e.preventDefault();
    setSubmitted(true);
    setPreview(formData.photoBase64);
  };

  const save = () => {
    const newCard = { ...formData };
    console.log(formData);

    const existing = JSON.parse(localStorage.getItem("studentCards")) || [];
    const updated = [...existing, newCard];
    localStorage.setItem("studentCards", JSON.stringify(updated));
  };
  const changetemplate = () => {
    const newIndex = (templateIndex + 1) % templates.length;
    setTemplateIndex(newIndex);
    setFormData((prev) => ({
      ...prev,
      template: templates[newIndex],
    }));
  };
  const showallrecord = () => {
    setshowform(false);
    const stored = localStorage.getItem("studentCards");
    if (stored) {
      setPreviousCards(JSON.parse(stored));
    }
    setShowPrevious(true);
  };
  const downloadCardAsImage = () => {
    if (!cardRef.current) return;

    const buttons = cardRef.current.querySelector(".card-buttons");
    if (buttons) buttons.style.display = "none"; // Hide before capture

    toPng(cardRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${formData.name}_ID_Card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Error downloading card as image:", err);
      })
      .finally(() => {
        if (buttons) buttons.style.display = "block"; // Show again after capture
      });
  };

  //   const downloadCardAsImage = () => {
  //     if (cardRef.current === null) return;
  //     toPng(cardRef.current, { cacheBust: true })
  //       .then((dataUrl) => {
  //         const link = document.createElement('a');
  //         link.download = `${formData.name}_ID_Card.png`;
  //         link.href = dataUrl;
  //         link.click();
  //       })
  //       .catch((err) => {
  //         console.error('Error downloading card as image:', err);
  //       });
  //   };

  return (
    <ErrorBoundary>
      <div
        className="mainbd"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        {showform && (
          <div className="max-w-xl mx-auto p-6 backdrop-blur-md bg-white/30 rounded-2xl shadow-lg mt-10 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Smart Student ID Generator
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-white">
              <input
                placeholder="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg placeholder-white text-white bg-transparent"
              />

              <input
                placeholder="Roll Number"
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg placeholder-white text-white bg-transparent"
              />

              <input
                placeholder="Class"
                type="text"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg placeholder-white text-white bg-transparent"
              />

              <Select
                name="classDivision"
                options={divisionOptions}
                placeholder="Select Division"
                value={divisionOptions.find(
                  (option) => option.value === formData.classDivision,
                )}
                onChange={(selected) =>
                  setFormData({ ...formData, classDivision: selected.value })
                }
                styles={selectStyles}
              />

              <Select
                isMulti
                name="allergies"
                options={allergyOptions}
                placeholder="Select allergies"
                value={formData.allergies.map((val) => ({
                  value: val,
                  label: val,
                }))}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    allergies: selected.map((opt) => opt.value),
                  })
                }
                styles={selectStyles}
              />

              <p className="text-xs text-white mt-1">
                Hold Ctrl (Windows) or ⌘ (Mac) to select multiple.
              </p>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm border p-2 rounded-lg text-white bg-transparent"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 h-32 w-32 object-cover rounded-full border"
                  />
                )}
              </div>

              <input
                placeholder="Rack Number"
                type="text"
                name="rackNumber"
                value={formData.rackNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg placeholder-white text-white bg-transparent"
              />

              <Select
                name="busRoute"
                options={busRouteOptions}
                placeholder="Select Bus Route"
                value={busRouteOptions.find(
                  (option) => option.value === formData.busRoute,
                )}
                onChange={(selected) =>
                  setFormData({ ...formData, busRoute: selected.value })
                }
                styles={selectStyles}
              />

              <div className="text-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
                >
                  Generate ID
                </button>
                <button
                  type="button"
                  onClick={showallrecord}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
                >
                  See Previous Cards
                </button>
              </div>
            </form>
          </div>
        )}

        {submitted && (
          <div className="whole">
            <div
              className=" box"
              style={{
                backgroundImage: `url(${templates[templateIndex]})`,
              }}
              ref={cardRef}
            >
              <div className="head">Student Id Card</div>

              <div className="body">
                <div className="left">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Roll Number:</strong> {formData.rollNumber}
                  </p>
                  <p>
                    <strong>Class:</strong> {formData.studentClass} -{" "}
                    {formData.classDivision}
                  </p>
                  <p>
                    <strong>Allergies:</strong>{" "}
                    {formData.allergies.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Rack:</strong> {formData.rackNumber}
                  </p>
                  <p>
                    <strong>Bus Route:</strong> {formData.busRoute}
                  </p>
                  <div className="mt-3">
                    <QRCode
                      value={JSON.stringify({
                        name: formData.name,
                        rollNumber: formData.rollNumber,
                        studentClass: formData.studentClass,
                        classDivision: formData.classDivision,
                        allergies: formData.allergies,
                        rackNumber: formData.rackNumber,
                        busRoute: formData.busRoute,
                      })}
                      size={66}
                    />
                  </div>
                </div>

                <div className="right">
                  {formData.photoBase64 && (
                    <img
                      src={formData.photoBase64}
                      alt="Student"
                      className="imgclass"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="gap">
              <button
                onClick={downloadCardAsImage}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
              >
                Download as PNG
              </button>
              <button
                onClick={save}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={changetemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
              >
                Switch Template
              </button>
            </div>
          </div>
        )}

        {showPrevious && previousCards.length > 0 && (
          <>
            <h1 className="myclass-1"> Previously Generated Cards</h1>
            <div className="showallcards">
              {previousCards.map((card, index) => (
                <>
                  <div
                    style={{
                      backgroundImage: `url(${card.template})`,
                    }}
                    ref={(el) => (previousRefs.current[index] = el)}
                    className=" mycards p-4 bg-white rounded-xl shadow-md text-center"
                  >
                    <div className="head">Student Id Card</div>
                    <div className="body">
                      <div className="left">
                        <p>
                          <strong>Name:</strong> {card.name}
                        </p>
                        <p>
                          <strong>Roll Number:</strong> {card.rollNumber}
                        </p>
                        <p>
                          <strong>Class:</strong> {card.studentClass} -{" "}
                          {card.classDivision}
                        </p>
                        <p>
                          <strong>Allergies:</strong>{" "}
                          {card.allergies.join(", ") || "None"}
                        </p>
                        <p>
                          <strong>Rack:</strong> {card.rackNumber}
                        </p>
                        <p>
                          <strong>Bus Route:</strong> {card.busRoute}
                        </p>

                        <QRCode
                          value={JSON.stringify({
                            name: card.name,
                            rollNumber: card.rollNumber,
                            studentClass: card.studentClass,
                            classDivision: card.classDivision,
                            allergies: card.allergies,
                            rackNumber: card.rackNumber,
                            busRoute: card.busRoute,
                          })}
                          size={46}
                        />
                      </div>
                      <div className="right">
                        {card.photoBase64 && (
                          <img
                            src={card.photoBase64}
                            alt="Student"
                            className="imgclass"
                          />
                        )}
                      </div>
                    </div>

                    {/* <h3 className="font-bold mb-2">Previous Card #{index + 1}</h3> */}

                    <div className="mt-2"></div>
                  </div>

                  <button
                    onClick={() =>
                      downloadPreviousCardAsImage(index, card.name)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl"
                  >
                    Download as PNG
                  </button>
                </>
              ))}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: "white",
    color: "white",
    borderRadius: "1rem",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#222",
    color: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "white" : "transparent",
    color: state.isSelected ? "black" : "white",
    ":hover": {
      backgroundColor: "#444",
      color: "white",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
};

export default Form;
