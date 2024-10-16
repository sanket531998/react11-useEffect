import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const alreadySelectedIds = localStorage.getItem("userSelectedPlaces")
  ? JSON.parse(localStorage.getItem("userSelectedPlaces"))
  : [];
const alreadySelectedPlaces = alreadySelectedIds.map((id) => {
  return AVAILABLE_PLACES.find((place) => place.id === id);
});

console.log(alreadySelectedPlaces, alreadySelectedIds);

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(alreadySelectedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    const userSelectedPlaces = localStorage.getItem("userSelectedPlaces")
      ? JSON.parse(localStorage.getItem("userSelectedPlaces"))
      : [];

    if (userSelectedPlaces.indexOf(id) === -1) {
      localStorage.setItem(
        "userSelectedPlaces",
        JSON.stringify([id, ...userSelectedPlaces])
      );
    }

    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }

  function handleRemovePlace() {
    const userSelectedPlaces = localStorage.getItem("userSelectedPlaces")
      ? JSON.parse(localStorage.getItem("userSelectedPlaces"))
      : [];
    const filteredArray = userSelectedPlaces.filter(
      (item) => item !== selectedPlace.current
    );
    localStorage.setItem("userSelectedPlaces", JSON.stringify(filteredArray));

    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);
  }

  return (
    <>
      <Modal modalIsOpen={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
