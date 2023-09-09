import axios from "axios"; //npm i axios        (libreria installata)
import React, { useState, useEffect } from "react";

//const stringMorse = ".-"; string usata di prova per testare il loop
const backgroundBaseColor = "black";
const backgroundActiveColor = "white";
const serverPath = "http://localhost:8080/api/v1/";
const endpoint = "answerMessage";
const idMessage = "1";
const morseDotTime = 1000;
const morseMinusTime = 3000;
const delayBeforeBlackScreen = 1000; // 1 secondo di schermo nero tra i caratteri

// 1) premendo la barra spaziatrice e tenendola premuta lo sfondo cambia da nero a bianco
// 2) premendo y o Y si avvia la get per ottenere un messaggio già tradotto da lingua corrente a morse dal server che viene poi mostrato come messaggio visivo a schermo
//il messaggio viene ripetuto finché non viene disattivato dall'utente premendo n o N la gestione automatica
const MorseApp = () => {
  const [backgroundColor, setBackgroundColor] =
    useState<string>(backgroundBaseColor);
  const [isSpaceBarPressed, setIsSpaceBarPressed] = useState<boolean>(false);
  const [isYKeyPressed, setIsYKeyPressed] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [helper, setHelper] = useState<boolean>(false);

  const divStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: backgroundColor,
    transition: "background-color 0.1s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === " ") {
        setBackgroundColor(backgroundActiveColor);
        setIsSpaceBarPressed(true);
      } else if ((event.key === "Y" || event.key === "y") && !isYKeyPressed) {
        setIsYKeyPressed(true);
        fetchData();
        if (!!!result) setIsYKeyPressed(false);
      } else if ((event.key === "N" || event.key === "n") && isYKeyPressed) {
        setIsYKeyPressed(false);
        setBackgroundColor(backgroundBaseColor);
        setCurrentIndex(0); // Reimposta l'indice quando premi "N"
        setIsProcessing(false);
      }
    };

    const handleKeyUp = (event: any) => {
      if (event.key === " ") {
        setBackgroundColor(backgroundBaseColor);
        setIsSpaceBarPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isYKeyPressed]);

  useEffect(() => {
    if (isYKeyPressed && currentIndex < result.length && !isProcessing) {
      const currentChar = result[currentIndex];
      let timeoutDuration =
        currentChar === "."
          ? morseDotTime
          : currentChar === "-"
          ? morseMinusTime
          : 0;

      setBackgroundColor(backgroundActiveColor);
      setIsProcessing(true);

      setTimeout(() => {
        setBackgroundColor(backgroundBaseColor);
      }, timeoutDuration);

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsProcessing(false);
      }, timeoutDuration + delayBeforeBlackScreen);
    } else if (isYKeyPressed && currentIndex === result.length) {
      // Se tutti i caratteri sono stati letti, ripeti il processo
      setCurrentIndex(0);
    }
  }, [isYKeyPressed, result, currentIndex, isProcessing]);

  const fetchData = () => {
    fetch(`${serverPath}${endpoint}/${idMessage}`)
      .then((response) => response.text())
      .then((data) => {
        setResult(data);
        setCurrentIndex(0);
        setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Errore durante la richiesta API:", error);
      });
  };
  /*
  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverPath}${endpoint}/${idMessage}`);
      const data = response.data;
      setResult(data);
      setCurrentIndex(0);
      setIsProcessing(false);
    } catch (error) {
      console.error("Errore durante la richiesta API:", error);
    }
  };*/

  return <div style={divStyle}></div>;
};

export default MorseApp;
